import { getSupabase } from '@/lib/supabase/get-client';

const BUCKET = 'cloudbasket-media';

export interface MediaFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  mime_type: string;
}

export async function listMediaFiles(folder: string = ''): Promise<MediaFile[] | null> {
  const supabase = await getSupabase();

  const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error || !data) return null;

  return data
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => {
      const path = folder ? `${folder}/${f.name}` : f.name;
      return {
        name: f.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
        size: f.metadata?.size ?? 0,
        created_at: f.created_at ?? '',
        mime_type: f.metadata?.mimetype ?? 'application/octet-stream',
      };
    });
}

export async function uploadMediaFile(file: File, folder: string = 'general'): Promise<string | null> {
  const supabase = await getSupabase();

  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) return null;

  return supabase.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl;
}

export async function deleteMediaFile(path: string): Promise<boolean> {
  const supabase = await getSupabase();

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  return !error;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
