/*
Ritta Test: Teachers
*/
import { beforeAll } from '@jest/globals';
import mongoose from 'mongoose';
import { UserService } from '../build/services';

let pekkaLahti = null;
let piaJaakkola = null;

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  pekkaLahti = await UserService.createTeacher('Pekka', 'Lahti', [
    'Liikunnanopettaja',
  ]);
  piaJaakkola = await UserService.createTeacher('Pia', 'Jaakkola', [
    'Kotitalous',
  ]);
});

describe('Abbrevation', function () {
  // Test
  it('Pekka Lahti returns LahPek', async () => {
    expect(pekkaLahti.abbrevation).toBe('LahPek');
  });

  it('Pia Jaakkola returns JaaPia', async () => {
    expect(piaJaakkola.abbrevation).toBe('JaaPia');
  });
});
