import { api } from '../helpers/api.js';
import { expect } from "chai";
import 'dotenv/config'
import { comTokenDeAdmin } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';
import testesDeMatriculas from '../fixtures/matriculas.json' with { type: 'json' };


describe('Matricula de Aluno em Disciplina', () =>{
    testesDeMatriculas.forEach(testeDeMatricula => {
        it.only (testeDeMatricula.testTitle, async() => {
        //Arrange (Given/Dado que/ Preparar)
        //Cadastrar o aluno e cadastrar a disciplina 
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(testeDeMatricula.dadosAluno);
        
        const alunoId = cadastroAlunoResposta.body.id;

        const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send(testeDeMatricula.dadosDisciplina);
                
            const disciplinaId = cadastroDisciplinaResposta.body.id;
   

        //Act (Agir/Executar)
        //Matricular o aluno
        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({ 
                alunoId:alunoId
            });
    
        //Assert (Validar)
        //Validar que o aluno de fato foi matriculado na disciplina
        expect(cadastroMatriculaResposta.status).to.equal(201);
        expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
        });
    });
});