import { EncounterData } from "@ziplodocus/zumbor-types";

const bucket = 'ziplod-assets';
const prefix = 'zumbor%2Fencounters%2F';
const baseUrl = 'https://firebasestorage.googleapis.com';

export async function exists(name: string, password: string) {
    const result = await fetch(
        `${baseUrl}/v0/b/${bucket}/o/${prefix}${name}.json?key=${password}`
    );
    if (result.status === 200) return true;
    if (result.status === 404) return false;
    if (result.status === 403) return new Error('Incorrect password');
    console.error(result);
    return new Error('Something has gone wrong checking file existence');
}

export async function upload(name: string, data: EncounterData, password: string) {
    const result = await fetch(
        `${baseUrl}/v0/b/${bucket}/o/${prefix}${name}.json?key=${password}`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    if (result.status === 200) return true;
    if (result.status === 403) return new Error('Incorrect password');
    console.error(result);
    return new Error('Something went wrong with the upload');
}
