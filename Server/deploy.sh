# Deploy script needs to avoid "sqs-consumer" and "ws"
echo "compiling..."
tsc

echo "installing production modules..."
rm -r node_modules
npm install -production
npm uninstall sqs-consumer ws

echo "zipping packages..."
cd build
zip -r ../scrape.zip . -x "./Websocket/*"
cd ..
zip -ur scrape.zip node_modules

echo "installing dev dependencies for local machine..."
npm install --only=dev

echo "uploading deployment package..."
aws s3 rm s3://alexstlambda/scrape.zip
aws s3 cp scrape.zip s3://alexstlambda

rm -f scrape.zip

echo "s3://alexstlambda/scrape.zip" | pbcopy
echo "The s3 file location has been saved to clipboard. Go to the aws lambda console."