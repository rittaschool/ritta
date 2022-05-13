import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { IErrorType, Permission, RittaError } from '@rittaschool/shared';
import { PermissionsGuard } from './permissions.guard';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsGuard],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no perms needed', () => {
      const context = createMock<ExecutionContext>();

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should return true if no perms needed but user has some', () => {
      const context = createMock<ExecutionContext>();
      context.getArgs = jest.fn().mockReturnValue([{ permissions: 1 }]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should return true if user has required perms', () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest
        .fn()
        .mockReturnValue([
          Permission.GET_ALL_USERS,
          Permission.DISABLE_LOGIN,
          Permission.DISABLE_REGISTER,
        ]);
      context.getArgs = jest.fn().mockReturnValue([{ permissions: 7 }]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw error if user does not have required perms', () => {
      const context = createMock<ExecutionContext>();
      reflector.get = jest
        .fn()
        .mockReturnValue([
          Permission.GET_ALL_USERS,
          Permission.DISABLE_LOGIN,
          Permission.DISABLE_REGISTER,
        ]);
      context.getArgs = jest.fn().mockReturnValue([{ permissions: 3 }]);

      // () => some jest thing
      expect(() => guard.canActivate(context)).toThrow(
        new RittaError('Invalid permissions.', IErrorType.INVALID_PERMISSION),
      );
    });
  });
});
