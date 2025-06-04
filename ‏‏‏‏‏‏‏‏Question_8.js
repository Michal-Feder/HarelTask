const AWS = require('aws-sdk');
const fs = require('fs'); 

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

const s3 = new AWS.S3();

const bucketName = 'YOUR_BUCKET_NAME'; 
const filePath = './path/to/your/local/file.txt'; 
const objectName = 'name-of-file-in-s3.txt'; 

fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const params = {
        Bucket: bucketName,
        Key: objectName, 
        Body: data, 
        ACL: 'private'
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error uploading file:', err);
        } else {
            console.log('File uploaded successfully. S3 Location:', data.Location);
            console.log('ETag:', data.ETag); 
            console.log('Key:', data.Key); 
        }
    });
});

const generatePresignedUrl = (key, expiresInSeconds = 3600) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: expiresInSeconds 
    };

    s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
            console.error('Error generating pre-signed URL:', err);
        } else {
            console.log('Pre-signed URL for download:', url);
        }
    });
};

// generatePresignedUrl(objectName);


// Example With cloudfront


const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const fs = require('fs');

const cloudfrontDistributionDomain = 'YOUR_CLOUDFRONT_DOMAIN.cloudfront.net';

const privateKey = fs.readFileSync('path/to/your/pk-YOUR_KEY_PAIR_ID.pem', 'utf8');

const keyPairId = 'YOUR_CLOUDFRONT_KEY_PAIR_ID';

const s3ObjectKey = 'path/to/your/file-in-s3.pdf';

const expiresInSeconds = 3600;

async function createCloudFrontSignedUrl() {
    const urlToSign = `https://<span class="math-inline">\{cloudfrontDistributionDomain\}/</span>{s3ObjectKey}`;

    try {
        const signedUrl = getSignedUrl({
            url: urlToSign,
            keyPairId: keyPairId,
            dateLessThan: Math.floor(Date.now() / 1000) + expiresInSeconds,
            privateKey: privateKey,
        });

        console.log('Generated CloudFront Signed URL:');
        console.log(signedUrl);
        return signedUrl;

    } catch (error) {
        console.error('Error generating CloudFront Signed URL:', error);
        throw error;
    }
}

createCloudFrontSignedUrl();

async function createCloudFrontSignedUrlWithCustomPolicy() {
    const urlToSign = `https://<span class="math-inline">\{cloudfrontDistributionDomain\}/</span>{s3ObjectKey}`;
    const expirationTime = Math.floor(Date.now() / 1000) + expiresInSeconds;

    const customPolicy = {
        Statement: [
            {
                Resource: urlToSign,
                Condition: {
                    DateLessThan: { "AWS:EpochTime": expirationTime },
                },
            },
        ],
    };

    try {
        const signedUrl = getSignedUrl({
            url: urlToSign,
            keyPairId: keyPairId,
            policy: JSON.stringify(customPolicy),
            privateKey: privateKey,
        });

        console.log('\nGenerated CloudFront Signed URL with Custom Policy:');
        console.log(signedUrl);
        return signedUrl;

    } catch (error) {
        console.error('Error generating CloudFront Signed URL with Custom Policy:', error);
        throw error;
    }
}

// createCloudFrontSignedUrlWithCustomPolicy();