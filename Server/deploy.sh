echo "compiling..."
tsc
rm -r node_modules
npm install -production

cd build
zip -r ../scrape.zip .
cd ..
zip -ur scrape.zip node_modules

npm install --only=dev

aws s3 rm s3://alexstlambda/scrape.zip
aws s3 cp scrape.zip s3://alexstlambda

rm -f scrape.zip

echo "s3://alexstlambda/scrape.zip" | pbcopy
echo "The s3 file location has been saved to clipboard. Go to the aws lambda console."