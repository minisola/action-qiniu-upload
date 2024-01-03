import * as core from '@actions/core';
import { genToken } from './token';
import { upload } from './upload';
import qiniu from 'qiniu';


async function run(): Promise<void> {
  try {
    const ak = core.getInput('access_key');
    const sk = core.getInput('secret_key');
    const bucket = core.getInput('bucket');
    const sourceDir = core.getInput('source_dir');
    const destDir = core.getInput('dest_dir');
    const ignoreSourceMap = core.getInput('ignore_source_map') === 'true';

    const token = genToken(bucket, ak, sk);

    const mac = new qiniu.auth.digest.Mac(ak, sk)


    upload(
      bucket,
      mac,
      sourceDir,
      destDir,
      ignoreSourceMap,
      (file, key) => core.info(`Success: ${file} => [${bucket}]: ${key}`),
      () => core.info('Done!'),
      (error) => core.setFailed(error.message),
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
