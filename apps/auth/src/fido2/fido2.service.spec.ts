import { Test, TestingModule } from '@nestjs/testing';
import { Fido2Service } from './fido2.service';

describe('Fido2Service', () => {
  let service: Fido2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Fido2Service],
    }).compile();

    service = module.get<Fido2Service>(Fido2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
