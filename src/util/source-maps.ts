import { join } from 'path';
import * as Constants from './constants';
import { getBooleanPropertyValue, readDirAsync, unlinkAsync } from './helpers';
import { BuildContext } from './interfaces';

export function purgeSourceMapsIfNeeded(context: BuildContext) {
  if (getBooleanPropertyValue(Constants.ENV_VAR_GENERATE_SOURCE_MAP)) {
    // keep the source maps and just return
    return Promise.resolve();
  }
  return readDirAsync(context.buildDir).then((fileNames: string[]) => {
    const sourceMaps = fileNames.filter(fileName => fileName.endsWith('.map'));
    const fullPaths = sourceMaps.map(sourceMap => join(context.buildDir, sourceMap));
    const promises: Promise<any>[] = [];
    for (const fullPath of fullPaths) {
      promises.push(unlinkAsync(fullPath));
    }
    return Promise.all(promises);
  });
}
