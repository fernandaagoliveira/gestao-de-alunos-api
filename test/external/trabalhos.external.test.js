import { api } from '../helpers/api.js';
import { expect } from 'chai';
import 'dotenv/config';
import { comTokenDeAdmin } from '../helpers/auth.js';
import { getToken } from '../helpers/auth.js';
import testesDeTrabalhos from '../fixtures/dados.json' with { type: 'json' };

describe('Fluxo completo de entrega de trabalho como aluno', () => {
    testesDeTrabalhos.forEach(testeDeTrabalho => {
        it(testeDeTrabalho.testTitle, async () => {
            //Arrange
            //Admin loga e cadastra o aluno
            const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(testeDeTrabalho.dadosAluno);

            const alunoId = cadastroAlunoResposta.body.id;

            //Admin cria a disciplina
            const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(testeDeTrabalho.dadosDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;

            //Admin matricula o aluno na disciplina
            await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({ alunoId: alunoId });
        
            //Act
            //Aluno loga
            const tokenAluno = await getToken(testeDeTrabalho.dadosAluno.email, testeDeTrabalho.dadosAluno.senha);

            //Aluno entrega o trabalho
            const entregaTrabalhoResposta = await api()
            .post(`/api/alunos/${alunoId}/trabalhos`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenAluno}`)
            .send({ ...testeDeTrabalho.dadosTrabalho, disciplinaId: disciplinaId });


            //Assert
            expect(entregaTrabalhoResposta.status).to.equal(201);
            expect(entregaTrabalhoResposta.body.titulo).to.equal(testeDeTrabalho.dadosTrabalho.titulo);
            expect(entregaTrabalhoResposta.body.status).to.equal('entregue');

        });
    });
});