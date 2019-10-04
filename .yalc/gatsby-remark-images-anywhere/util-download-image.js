"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gatsby_source_filesystem_1 = require("gatsby-source-filesystem");
const gatsby_plugin_sharp_1 = __importDefault(require("gatsby-plugin-sharp"));
exports.downloadImage = async ({ id, url, store, getNode, touchNode, cache, createNode, createNodeId, reporter, }) => {
    let imageFileNode;
    const mediaDataCacheKey = `gria-${url}`;
    const cacheMediaData = await cache.get(mediaDataCacheKey);
    console.log('IS IT IN THE CACHE? IS IT IN THE CACHE?');
    if (cacheMediaData && cacheMediaData.fileNodeId) {
        console.log('WELL THE CACHE IS HERE');
        const fileNodeId = cacheMediaData.fileNodeId;
        touchNode({
            nodeId: fileNodeId,
        });
        const fileNode = getNode(fileNodeId);
        console.log('HERE IS THE NODE ID');
        console.log(fileNodeId);
        if (fileNode) {
            console.log('OH BABY ITS IN THE CACHE ALRIGHT');
            touchNode({
                nodeId: fileNodeId,
            });
            imageFileNode = fileNode;
        }
    }
    if (!imageFileNode) {
        console.log('IT IS NOT IN THE CACHE');
        try {
            const imageUrl = process.env.LOW_WIFI_MODE
                ? 'https://placekitten.com/1200/800'
                : url;
            const fileNode = await gatsby_source_filesystem_1.createRemoteFileNode({
                url: imageUrl,
                store,
                cache,
                createNode,
                createNodeId,
                reporter,
                parentNodeId: id,
            });
            if (fileNode) {
                imageFileNode = fileNode;
                await cache.set(mediaDataCacheKey, {
                    fileNodeId: fileNode.id
                });
                console.log('FRESH NODE');
                console.log(getNode(fileNode.id));
            }
        }
        catch (e) {
            reporter.warn(`failed to download ${url}`);
        }
    }
    return imageFileNode;
};
exports.processImage = async ({ file, reporter, cache, pathPrefix, sharpMethod, imageOptions, }) => {
    const args = Object.assign({ pathPrefix }, imageOptions);
    const getImage = gatsby_plugin_sharp_1.default[sharpMethod];
    return getImage({
        file,
        args,
        reporter,
        cache,
    });
};
