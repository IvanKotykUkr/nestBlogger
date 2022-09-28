import { Controller, Delete } from '@nestjs/common';
import mongoose from 'mongoose';

@Controller('/testing')
export class DeleteTest {
  @Delete('/all-data')
  async deleteAll() {
    console.log('ww');

    mongoose.connect(process.env.MONGO_URL, function () {
      /* Drop the DB */
      mongoose.connection.db.dropDatabase();
      return;
    });
  }
}
