import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadOptions } from './file-upload-options.interface';

@Injectable()
export class S3Service {
    private readonly client: S3Client;

    constructor(private readonly configService: ConfigService) {
        const accessKeyId = configService.get('AWS_ACCESS_KEY');
        const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY');

        const clietnConfig: S3ClientConfig = {};

        if(accessKeyId && secretAccessKey){
            clietnConfig.credentials = {
                accessKeyId,
                secretAccessKey
            }
        }

        this.client = new S3Client(clietnConfig);
    }

    async upload({ bucket, key, file }: FileUploadOptions){
        await this.client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file
            })
        );
    }

    getObjectUrl(bucket: string, key: string){
        return `https://${bucket}.s3.amazonws.com/${key}`;
    }
}
