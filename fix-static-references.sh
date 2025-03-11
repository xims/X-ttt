#!/bin/bash

# Fix HTML references
sed -i '' 's|/static/style.css|/style.css|g' react_ws_src/index.html
sed -i '' 's|/static/bundle.js|/bundle.js|g' react_ws_src/index.html

# Fix webpack config to use fixed filenames
sed -i '' 's|filename: "\[name\].\[contenthash\].js"|filename: "bundle.js"|g' react_ws_src/webpack.config.prod.js
sed -i '' 's|chunkFilename: "\[name\].\[contenthash\].js"|chunkFilename: "[name].chunk.js"|g' react_ws_src/webpack.config.prod.js
sed -i '' 's|filename: "style.\[contenthash\].css"|filename: "style.css"|g' react_ws_src/webpack.config.prod.js

echo "Fixed static file references. Now run 'npm run deploy:mac' in the react_ws_src directory." 