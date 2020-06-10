rm -r node_modules
npm install -production

zip -r scrape.zip build/.
zip -ur scrape.zip node_modules

npm install --only=dev

aws s3 rm s3://alexstlambda/scrape.zip
aws s3 cp scrape.zip s3://alexstlambda

rm -f scrape.zip