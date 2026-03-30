import DataUriParser from 'datauri/parser.js';
import path from 'path';
const getBuffer = async (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};
export default getBuffer;
