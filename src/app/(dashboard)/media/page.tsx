import { listMediaFiles, formatFileSize } from '@/services/media-manager';
import Image from 'next/image';

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']);

function isImage(name: string): boolean {
  return IMAGE_EXTS.has(name.split('.').pop()?.toLowerCase() ?? '');
}

interface PageProps {
  searchParams: Promise<{ folder?: string }>;
}

export default async function MediaPage({ searchParams }: PageProps) {
  const { folder = '' } = await searchParams;
  const files = await listMediaFiles(folder);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          {folder && (
            <p className="text-sm text-gray-500 mt-1">
              Folder: <span className="font-mono">{folder}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {folder && (
            <a
              href="/media"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Back
            </a>
          )}
          <a
            href="/media/upload"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Upload Files
          </a>
        </div>
      </div>

      {!files ? (
        <p className="text-red-500 text-sm">Failed to load media files.</p>
      ) : files.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-16 text-center">
          <p className="text-gray-400 text-sm">No files in this folder.</p>
          <a href="/media/upload" className="mt-3 inline-block text-indigo-600 text-sm hover:underline">
            Upload your first file
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                {isImage(file.name) ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <span className="text-sm text-gray-400">FILE</span>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-800 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(file.size)}</p>
                <div className="flex gap-2 mt-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">{files?.length ?? 0} file(s)</p>
    </div>
  );
}
