import { S3Client, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } from '@aws-sdk/client-s3'

const s3ConFig = {
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SERCET_KEY
    }
};

const s3 = new S3Client(s3ConFig);

export {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteBucketCommand
}