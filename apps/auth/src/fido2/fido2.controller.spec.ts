import { Test, TestingModule } from '@nestjs/testing';
import { Fido2Controller } from './fido2.controller';

describe('Fido2Controller', () => {
  let controller: Fido2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Fido2Controller],
      providers: [
        {
          provide: 'FIDO2_SERVICE',
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<Fido2Controller>(Fido2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
