import { NextResponse } from "next/server";
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage'

export async function POST(request) {
    try {
        const s3Client = new S3Client({
            endpoint: process.env.DO_SPACES_URL,
            region: "sfo3",
            credentials: {
                accessKeyId: process.env.DO_SPACES_ID,
                secretAccessKey: process.env.DO_SPACES_SECRET
            }
        });

        const { emails } = await request.json();

        const metaupload = new Upload({
            client: s3Client,
            params: {
                Bucket: process.env.DO_SPACES_BUCKET,
                Key: "uic-statt0/log/emails.example.json",
                Body: JSON.stringify({
                    emails: emails
                }),
                ContentType: "application/json",
                ACL: "public-read"
                // ACL: "private"
            },
        });

        await metaupload.done();

        return NextResponse.json({ message: "emails saved successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save emails" }, { status: 500 });
    }
}