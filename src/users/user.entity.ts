import { Column, Entity, Unique, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Unique(['email', 'phoneNumber'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;
}
