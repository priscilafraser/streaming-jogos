import { Jogo } from 'src/jogos/jogo.entity';
import * as bcrypt from 'bcrypt';
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  usuario: string;

  @Column({ nullable: false, type: 'varchar', length: 40 })
  nascimento: string;

  @Column({ nullable: false, type: 'varchar', length: 40 })
  pais: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  confirmacaoToken: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  recoverToken: string;

  @CreateDateColumn()
  criacao: Date;

  @UpdateDateColumn()
  modificacao: Date;

  @ManyToMany(() => Jogo, (jogo) => jogo.users)
  @JoinTable({ name: 'user_jogos' })
  jogos: Jogo[];

  addJogos(jogo: Jogo) {
    if (this.jogos == null) {
      this.jogos = new Array<Jogo>();
    }
    this.jogos.push(jogo);
  }

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
