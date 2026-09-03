import { readFile } from 'node:fs/promises';
import path from 'node:path';
export const root=path.resolve(new URL('..',import.meta.url).pathname);
export async function registry(){return JSON.parse(await readFile(path.join(root,'registry/apps.json'),'utf8'))}
export function validSlug(slug){return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)}
