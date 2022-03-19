import { Test, TestingModule } from '@nestjs/testing';
import { Fido2Resolver } from './fido2.resolver';

describe('Fido2Resolver', () => {
  let resolver: Fido2Resolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Fido2Resolver,
        {
          provide: 'FIDO2_SERVICE',
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<Fido2Resolver>(Fido2Resolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
