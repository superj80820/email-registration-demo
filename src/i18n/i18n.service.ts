import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class I18NService {
  private i18n;

  constructor() {
    const i18nFile = path.resolve(__dirname, '../../public', 'i18n.json');
    this.i18n = JSON.parse(fs.readFileSync(i18nFile, { encoding: 'utf-8' }));
  }

  getMessage(messageKey: string, locale: string): string {
    return this.i18n[locale][messageKey];
  }
}
