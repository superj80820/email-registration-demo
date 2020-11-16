import { Test, TestingModule } from '@nestjs/testing';
import { I18NService } from './i18n.service';

describe('I18NService', () => {
  let service: I18NService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [I18NService],
    }).compile();

    service = moduleRef.get<I18NService>(I18NService);
  });

  it('should return default "zh-TW" value', () => {
    expect(service.getMessage('welcome')).toBe('您好！ 歡迎加入 AmazingTalker');
  });

  it('should return "zh-TW" value when locale not pass', () => {
    expect(service.getMessage('welcome')).toBe('您好！ 歡迎加入 AmazingTalker');
  });

  it('should return "zh-TW" value when locale not exist', () => {
    expect(service.getMessage('welcome', 'Not exist locale')).toBe(
      '您好！ 歡迎加入 AmazingTalker',
    );
  });
});
