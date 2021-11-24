import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class Jogo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  titulo: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  imagem_url: string;

  @Column({ nullable: false, type: 'varchar', length: 600 })
  descricao: string;

  @Column({ nullable: false, type: 'varchar', length: 60 })
  genero: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  lancamento: string;

  @CreateDateColumn()
  criacao: Date;

  @UpdateDateColumn()
  modificacao: Date;

  @ManyToMany(() => User, (user) => user.jogos, {
    cascade: true,
  })
  @JoinTable()
  users: User[];

  addUsers(user: User) {
    if (this.users == null) {
      this.users = new Array<User>();
    }
    this.users.push(user);
  }
}
