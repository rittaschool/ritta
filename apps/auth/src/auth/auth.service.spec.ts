// import { Test, TestingModule } from '@nestjs/testing';
// import { IErrorType, ILoginResponse, RittaError } from '@rittaschool/shared';
// import { AuthService } from './auth.service';
// import cryptor from './cryptor';
// import mfa from './mfa';
// import tokenizer from './tokenizer';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         {
//           provide: 'AUTH_SERVICE',
//           useClass: AuthService,
//         },
//         {
//           provide: 'USERS_SERVICE',
//           useValue: {
//             findAll: jest.fn().mockReturnValue([
//               {
//                 id: 1,
//                 username: 'tester',
//                 password: 'hashed124',
//                 mfa: {
//                   enabled: false,
//                 },
//               },
//               {
//                 id: 2,
//                 username: 'testerWithMfa',
//                 password: 'hashed124withMfa',
//                 mfa: {
//                   enabled: true,
//                   secret: 'secret',
//                 },
//               },
//             ]),
//             findOne: jest.fn().mockReturnValue({
//               id: 2,
//               username: 'testerWithMfa',
//               password: 'hashed124withMfa',
//               mfa: {
//                 enabled: true,
//                 secret: 'secret',
//               },
//             }),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<AuthService>('AUTH_SERVICE');

//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('login', () => {
//     describe('login', () => {
//       it('should return a user', async () => {
//         // Mock the cryptor
//         jest
//           .spyOn(cryptor, 'verifyPassword')
//           .mockImplementation(async () => true);

//         // Mock the token generator
//         jest
//           .spyOn(tokenizer, 'signToken')
//           .mockImplementationOnce(async () => 'token')
//           .mockImplementationOnce(async () => 'refresh_token');

//         // Run the service code
//         const result = await service.login({
//           username: 'tester',
//           password: '123456',
//         });

//         expect(result.type).toBe(ILoginResponse.LOGGED_IN);
//         expect(result.token).toBe('token');
//       });

//       it('should throw invalid credentials error', async () => {
//         // Mock the cryptor
//         jest
//           .spyOn(cryptor, 'verifyPassword')
//           .mockImplementation(async () => false);

//         // Run the service code
//         try {
//           await service.login({
//             username: 'tester',
//             password: '123456',
//           });
//         } catch (err) {
//           expect(err.type).toBe(IErrorType.INVALID_CREDENTIALS);
//         }
//       });

//       it('should ask user for mfa code', async () => {
//         // Mock the cryptor
//         jest
//           .spyOn(cryptor, 'verifyPassword')
//           .mockImplementation(async () => true);

//         // Mock the token generator
//         jest
//           .spyOn(tokenizer, 'signToken')
//           .mockImplementationOnce(async () => 'token');

//         // Run the service code
//         const result = await service.login({
//           username: 'testerWithMfa',
//           password: '123456',
//         });

//         expect(result.type).toBe(ILoginResponse.MFA_REQUIRED);
//         expect(result.token).toBe('token');
//       });
//     });

//     describe('loginMFA', () => {
//       it('should throw invalid token', async () => {
//         try {
//           await service.loginMFA({
//             mfaCode: '12345',
//             mfaToken: 'mfa_token',
//           });
//         } catch (error) {
//           expect(error.type).toBe(IErrorType.INVALID_TOKEN);
//         }
//       });

//       it('should throw invalid mfa code', async () => {
//         // Mock the tokenizer
//         jest
//           .spyOn(tokenizer, 'verifyToken')
//           .mockImplementationOnce(async () => true);
//         try {
//           await service.loginMFA({
//             mfaCode: '12345',
//             mfaToken: 'mfa_token',
//           });
//         } catch (error) {
//           expect(error).toStrictEqual(
//             new RittaError('Invalid MFA code', IErrorType.INVALID_TOKEN), // TODO: change in shared@0.0.20 to INVALID_MFA_CODE
//           );
//           expect(error.type).toBe(IErrorType.INVALID_TOKEN); // TODO: change in shared@0.0.20 to INVALID_MFA_CODE
//         }
//       });

//       it('should return a user', async () => {
//         // Mock the tokenizer
//         jest
//           .spyOn(tokenizer, 'signToken')
//           .mockImplementationOnce(async () => 'token')
//           .mockImplementationOnce(async () => 'refresh_token');
//         jest
//           .spyOn(tokenizer, 'verifyToken')
//           .mockImplementationOnce(async () => true);

//         // Mock the mfa validator
//         jest.spyOn(mfa, 'checkMfaCode').mockImplementationOnce(() => true);

//         // Call the function
//         const result = await service.loginMFA({
//           mfaCode: '12345',
//           mfaToken: 'mfa_token',
//         });

//         expect(result.type).toBe(ILoginResponse.LOGGED_IN);
//         expect(result.token).toBe('token');
//       });
//     });
//   });
// });
