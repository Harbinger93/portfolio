import { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../i18n/context';
import { Upload, FileImage, FileText, Download, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import GlowCard from '../ui/GlowCard';

interface ProcessedFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
  type: 'image' | 'pdf';
  status: 'pending' | 'processing' | 'completed' | 'error';
  errorMsg?: string;
}

export default function ImageOptimizer() {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<'image' | 'pdf'>('image');
  const [quality, setQuality] = useState<number>(0.8);
  const [pdfQuality, setPdfQuality] = useState<number>(0.6); // Escala/calidad para PDF
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar dinámicamente las dependencias de PDF.js y jsPDF cuando se activa la pestaña PDF
  const [pdfLibsLoaded, setPdfLibsLoaded] = useState(false);
  const [pdfLibsLoading, setPdfLibsLoading] = useState(false);

  const loadPdfLibs = async () => {
    if (pdfLibsLoaded || pdfLibsLoading) return;
    setPdfLibsLoading(true);
    setProgressMsg(locale === 'es' ? 'Cargando motor de procesamiento PDF...' : 'Loading PDF processing engine...');
    try {
      // Cargar PDF.js
      await new Promise<void>((resolve, reject) => {
        if (window.pdfjsLib) return resolve();
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PDF.js'));
        document.head.appendChild(script);
      });

      // Configurar worker de PDF.js
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      // Cargar jsPDF
      await new Promise<void>((resolve, reject) => {
        if (window.jspdf) return resolve();
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load jsPDF'));
        document.head.appendChild(script);
      });

      setPdfLibsLoaded(true);
    } catch (error) {
      console.error('Error loading PDF libraries:', error);
    } finally {
      setPdfLibsLoading(false);
      setProgressMsg('');
    }
  };

  useEffect(() => {
    if (activeTab === 'pdf') {
      loadPdfLibs();
    }
  }, [activeTab]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processInputFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processInputFiles(Array.from(e.target.files));
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processInputFiles = async (inputFiles: File[]) => {
    const validFiles = inputFiles.filter(file => {
      if (activeTab === 'image') {
        return file.type.startsWith('image/') && (file.type.includes('png') || file.type.includes('jpeg') || file.type.includes('jpg'));
      } else {
        return file.type === 'application/pdf';
      }
    });

    if (validFiles.length === 0) return;

    setIsProcessing(true);

    if (activeTab === 'image') {
      for (const file of validFiles) {
        const fileId = Math.random().toString(36).substring(7);
        const newFile: ProcessedFile = {
          id: fileId,
          name: file.name,
          originalSize: file.size,
          compressedSize: 0,
          url: '',
          type: 'image',
          status: 'processing'
        };
        setFiles(prev => [newFile, ...prev]);

        try {
          const webpData = await compressImageToWebp(file, quality);
          setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              return {
                ...f,
                compressedSize: webpData.size,
                url: URL.createObjectURL(webpData.blob),
                name: file.name.replace(/\.[^/.]+$/, "") + '.webp',
                status: 'completed'
              };
            }
            return f;
          }));
        } catch (err: any) {
          setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              return { ...f, status: 'error', errorMsg: err.message || 'Error' };
            }
            return f;
          }));
        }
      }
    } else {
      // PDF Compresión
      // Cargar librerías si aún no están listas
      if (!pdfLibsLoaded) {
        await loadPdfLibs();
      }

      for (const file of validFiles) {
        const fileId = Math.random().toString(36).substring(7);
        const newFile: ProcessedFile = {
          id: fileId,
          name: file.name,
          originalSize: file.size,
          compressedSize: 0,
          url: '',
          type: 'pdf',
          status: 'processing'
        };
        setFiles(prev => [newFile, ...prev]);

        try {
          const compressedPdfBlob = await compressPdfFile(file, pdfQuality, (progress) => {
            setProgressMsg(
              locale === 'es' 
                ? `Procesando PDF: ${progress}`
                : `Processing PDF: ${progress}`
            );
          });

          setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              return {
                ...f,
                compressedSize: compressedPdfBlob.size,
                url: URL.createObjectURL(compressedPdfBlob),
                name: file.name.replace(/\.[^/.]+$/, "") + '_opt.pdf',
                status: 'completed'
              };
            }
            return f;
          }));
        } catch (err: any) {
          console.error(err);
          setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              return { ...f, status: 'error', errorMsg: err.message || 'Error en compresión' };
            }
            return f;
          }));
        }
      }
    }

    setIsProcessing(false);
    setProgressMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const compressImageToWebp = (file: File, quality: number): Promise<{ blob: Blob; size: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context error'));
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ blob, size: blob.size });
              } else {
                reject(new Error('WebP generation failed'));
              }
            },
            'image/webp',
            quality
          );
        };
        img.onerror = () => reject(new Error('Image load error'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  };

  const compressPdfFile = async (file: File, scaleFactor: number, onProgress: (msg: string) => void): Promise<Blob> => {
    if (!window.pdfjsLib || !window.jspdf) {
      throw new Error(
        locale === 'es'
          ? 'Librerías de procesamiento de PDF no disponibles.'
          : 'PDF processing libraries not loaded.'
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdfDoc.numPages;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      compress: true
    });

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      onProgress(
        locale === 'es'
          ? `Renderizando página ${pageNum} de ${totalPages}...`
          : `Rendering page ${pageNum} of ${totalPages}...`
      );

      const page = await pdfDoc.getPage(pageNum);
      // Reducimos la escala según la calidad deseada. Calidad 0.6 = escala 1.2x.
      // Escala 1.5 es excelente calidad, 1.0 es media.
      const viewport = page.getViewport({ scale: scaleFactor * 2.0 }); 
      
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context error');

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Convertir a JPEG con compresión ajustable
      const imgData = canvas.toDataURL('image/jpeg', scaleFactor);

      if (pageNum > 1) {
        doc.addPage([viewport.width, viewport.height]);
      } else {
        // Ajustar el tamaño de la primera página
        doc.internal.pageSize.width = viewport.width;
        doc.internal.pageSize.height = viewport.height;
      }

      doc.addImage(imgData, 'JPEG', 0, 0, viewport.width, viewport.height, undefined, 'FAST');
    }

    onProgress(
      locale === 'es' ? 'Ensamblando documento final...' : 'Assembling final document...'
    );

    return doc.output('blob');
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-4 leading-tight">
          {locale === 'es' ? 'Optimizador de Imágenes y PDF' : 'Image & PDF Optimizer'}
        </h1>
        <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
          {locale === 'es' 
            ? 'Reduce el peso de tus archivos de forma segura y directa en tu navegador. Tus archivos nunca son subidos a ningún servidor externo.' 
            : 'Safely reduce your file sizes directly inside your browser. Your files are never uploaded to any external server.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-[var(--bg-secondary)] border border-glass-border p-1.5 rounded-full shadow-lg">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'image'
                ? 'bg-[var(--accent-primary)] text-black shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileImage className="w-4 h-4" />
            {locale === 'es' ? 'Imágenes' : 'Images'}
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'pdf'
                ? 'bg-[var(--accent-primary)] text-black shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Optimizer Config & Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Quality Controls */}
        <div className="lg:col-span-1">
          <GlowCard className="h-full border border-glass-border">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">
              {locale === 'es' ? 'Configuración' : 'Settings'}
            </h3>
            
            {activeTab === 'image' ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase mb-2">
                    <span>{locale === 'es' ? 'Calidad WebP' : 'WebP Quality'}</span>
                    <span className="text-[var(--accent-primary)]">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)] border border-glass-border"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {locale === 'es' 
                      ? '80% ofrece el equilibrio perfecto entre calidad visual e increíble reducción de peso.' 
                      : '80% is the ideal balance between visual quality and file size reduction.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase mb-2">
                    <span>{locale === 'es' ? 'Nivel de Compresión' : 'Compression Level'}</span>
                    <span className="text-[var(--accent-primary)]">
                      {pdfQuality <= 0.4 ? (locale === 'es' ? 'Alto' : 'High') : pdfQuality <= 0.7 ? (locale === 'es' ? 'Medio' : 'Medium') : (locale === 'es' ? 'Bajo' : 'Low')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="0.9"
                    step="0.1"
                    value={pdfQuality}
                    onChange={(e) => setPdfQuality(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)] border border-glass-border"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {locale === 'es'
                      ? 'La compresión alta reduce la resolución interna del PDF para lograr un archivo sumamente liviano.'
                      : 'High compression lowers internal image resolution to provide a lightweight file.'}
                  </p>
                </div>
                {pdfLibsLoading && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--accent-primary)]" />
                    <span>{progressMsg}</span>
                  </div>
                )}
              </div>
            )}
          </GlowCard>
        </div>

        {/* Dropzone Area */}
        <div className="lg:col-span-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center h-full min-h-[250px] ${
              isDragOver
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 shadow-[0_0_20px_rgba(0,242,254,0.05)]'
                : 'border-glass-border bg-[var(--bg-secondary)]/30 hover:border-[var(--accent-primary)]/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={activeTab === 'image' ? 'image/png, image/jpeg, image/jpg' : 'application/pdf'}
              multiple={activeTab === 'image'}
              className="hidden"
            />
            
            <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] border border-glass-border flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
              <Upload className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
            </div>

            <p className="text-base font-bold text-[var(--text-primary)] mb-2">
              {locale === 'es' ? 'Arrastra tus archivos aquí' : 'Drag & drop your files here'}
            </p>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-1">
              {activeTab === 'image'
                ? (locale === 'es' ? 'Soporta formatos JPG, JPEG y PNG de forma ilimitada' : 'Supports JPG, JPEG and PNG formats limitlessly')
                : (locale === 'es' ? 'Sube un archivo PDF para comprimirlo' : 'Upload a PDF file to compress')}
            </p>
            <p className="text-[10px] text-[var(--accent-primary)] font-bold tracking-widest uppercase mt-4">
              {locale === 'es' ? 'O Selecciona desde tu Equipo' : 'Or Select from Device'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Monitor */}
      {isProcessing && progressMsg && (
        <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] border border-glass-border rounded-xl mb-8 animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent-primary)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">{progressMsg}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {locale === 'es' ? 'Archivos Procesados' : 'Processed Files'}
            </h3>
            <button
              onClick={() => setFiles([])}
              className="text-xs font-semibold uppercase tracking-wider text-rose-500/80 hover:text-rose-500 transition-colors"
            >
              {locale === 'es' ? 'Limpiar Lista' : 'Clear All'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {files.map((file) => {
              const reduction = file.originalSize > 0 && file.compressedSize > 0
                ? Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100)
                : 0;

              return (
                <div
                  key={file.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-[var(--bg-secondary)] border border-glass-border rounded-2xl gap-4 transition-all duration-300 hover:border-white/10"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${
                      file.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : file.status === 'error'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {file.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : file.status === 'error' ? (
                        <AlertCircle className="w-6 h-6" />
                      ) : (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate max-w-[250px] md:max-w-[320px]">
                        {file.name}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-secondary)] mt-1">
                        <span>{locale === 'es' ? 'Original:' : 'Original:'} <strong className="text-[var(--text-primary)]">{formatSize(file.originalSize)}</strong></span>
                        {file.status === 'completed' && (
                          <>
                            <span>•</span>
                            <span>{locale === 'es' ? 'Optimizado:' : 'Optimized:'} <strong className="text-[var(--text-primary)]">{formatSize(file.compressedSize)}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-glass-border pt-3 md:pt-0">
                    {file.status === 'completed' && reduction > 0 && (
                      <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                        -{reduction}%
                      </span>
                    )}

                    {file.status === 'completed' && (
                      <a
                        href={file.url}
                        download={file.name}
                        className="flex items-center justify-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md w-full md:w-auto"
                      >
                        <Download className="w-4 h-4" />
                        <span>{locale === 'es' ? 'Descargar' : 'Download'}</span>
                      </a>
                    )}

                    {file.status === 'processing' && (
                      <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400 animate-pulse">
                        {locale === 'es' ? 'Optimizando...' : 'Optimizing...'}
                      </span>
                    )}

                    {file.status === 'error' && (
                      <span className="text-xs font-semibold tracking-wider uppercase text-rose-400">
                        {file.errorMsg || (locale === 'es' ? 'Error' : 'Error')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
