from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, AliasChoices
from database import (
    SessionLocal,
    Equipamento as EquipamentoDB,
    Historico as HistoricoDB,
    Manutencao as ManutencaoDB,
    Anexo as AnexoDB
)

import shutil
import os
from datetime import datetime


app = FastAPI()


def criar_backup_banco():
    pasta_backups = "backups"

    os.makedirs(
        pasta_backups,
        exist_ok=True
    )

    nome_backup = (
        f"inventario_"
        f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.db"
    )

    caminho_backup = os.path.join(
        pasta_backups,
        nome_backup
    )

    shutil.copy2(
        "inventario.db",
        caminho_backup
    )

    print(
        f"Backup criado: {caminho_backup}"
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Historico(BaseModel):
    tipo: str
    descricao: str | None = None
    data: str | None = None
    situacao_manutencao: str | None = None
    motivo: str | None = None
    observacao: str | None = None
    data_conclusao: str | None = None
    localizacao: str | None = None
    responsavel: str | None = None
    status: str | None = None


class Manutencao(BaseModel):
    equipamento_id: int
    data: str | None = None
    situacao: str | None = None
    motivo: str | None = None
    observacao: str | None = None
    data_conclusao: str | None = None


class Equipamento(BaseModel):
    tipo: str
    fabricante: str
    modelo: str
    marca: str | None = None

    numero_serie: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "numeroSerie",
            "numero_serie"
        )
    )

    data_fabricacao: str | None = Field(
        default=None,
        validation_alias=AliasChoices(
            "dataFabricacao",
            "data_fabricacao"
        )
    )

    status: str
    responsavel: str | None = None
    setor: str | None = None
    localizacao: str | None = None
    historico: list[Historico] = []


@app.get("/")
def inicio():
    return {
        "mensagem": "API do Inventário TI funcionando!"
    }


@app.get("/equipamentos")
def listar_equipamentos():
    db = SessionLocal()

    equipamentos = db.query(EquipamentoDB).filter(
        EquipamentoDB.ativo == 1
    ).all()

    db.close()

    return equipamentos


@app.get("/manutencoes")
def listar_manutencoes():
    db = SessionLocal()

    manutencoes = db.query(ManutencaoDB).all()

    db.close()

    return manutencoes


@app.get("/historico")
def listar_historico():
    db = SessionLocal()

    historico = db.query(HistoricoDB).all()

    db.close()

    return historico


@app.delete("/equipamentos/{equipamento_id}")
def excluir_equipamento(equipamento_id: int):
    db = SessionLocal()

    equipamento = db.query(EquipamentoDB).filter(
        EquipamentoDB.id == equipamento_id
    ).first()

    if not equipamento:
        db.close()

        return {
            "erro": "Equipamento não encontrado!"
        }

    equipamento.ativo = 0

    db.commit()
    db.close()

    return {
        "mensagem": "Equipamento movido para a lixeira com sucesso!"
    }


@app.put("/equipamentos/{equipamento_id}")
def atualizar_equipamento(
    equipamento_id: int,
    equipamento: Equipamento
):
    criar_backup_banco()

    db = SessionLocal()

    equipamento_existente = db.query(EquipamentoDB).filter(
        EquipamentoDB.id == equipamento_id
    ).first()

    if not equipamento_existente:
        db.close()

        return {
            "erro": "Equipamento não encontrado!"
        }

    equipamento_existente.tipo = equipamento.tipo
    equipamento_existente.fabricante = equipamento.fabricante
    equipamento_existente.modelo = equipamento.modelo
    equipamento_existente.marca = equipamento.marca
    equipamento_existente.numero_serie = equipamento.numero_serie
    equipamento_existente.data_fabricacao = equipamento.data_fabricacao
    equipamento_existente.status = equipamento.status
    equipamento_existente.responsavel = equipamento.responsavel
    equipamento_existente.setor = equipamento.setor
    equipamento_existente.localizacao = equipamento.localizacao

    for evento in equipamento.historico:
        novo_historico = HistoricoDB(
            equipamento_id=equipamento_existente.id,
            tipo=evento.tipo,
            descricao=evento.descricao,
            data=evento.data,
            situacao_manutencao=evento.situacao_manutencao,
            motivo=evento.motivo,
            observacao=evento.observacao,
            data_conclusao=evento.data_conclusao,
            localizacao=evento.localizacao,
            responsavel=evento.responsavel,
            status=evento.status
        )

        db.add(novo_historico)

    db.commit()
    db.refresh(equipamento_existente)

    resultado = {
        "id": equipamento_existente.id,
        "tipo": equipamento_existente.tipo,
        "fabricante": equipamento_existente.fabricante,
        "modelo": equipamento_existente.modelo,
        "marca": equipamento_existente.marca,
        "numero_serie": equipamento_existente.numero_serie,
        "data_fabricacao": equipamento_existente.data_fabricacao,
        "status": equipamento_existente.status,
        "responsavel": equipamento_existente.responsavel,
        "setor": equipamento_existente.setor,
        "localizacao": equipamento_existente.localizacao
    }

    db.close()

    return {
        "mensagem": "Equipamento atualizado com sucesso!",
        "equipamento": resultado
    }


@app.post("/equipamentos")
def criar_equipamento(equipamento: Equipamento):
    criar_backup_banco()

    db = SessionLocal()

    novo_equipamento = EquipamentoDB(
        tipo=equipamento.tipo,
        fabricante=equipamento.fabricante,
        modelo=equipamento.modelo,
        marca=equipamento.marca,
        numero_serie=equipamento.numero_serie,
        data_fabricacao=equipamento.data_fabricacao,
        status=equipamento.status,
        responsavel=equipamento.responsavel,
        setor=equipamento.setor,
        localizacao=equipamento.localizacao
    )

    db.add(novo_equipamento)
    db.commit()
    db.refresh(novo_equipamento)

    for evento in equipamento.historico:
        novo_historico = HistoricoDB(
            equipamento_id=novo_equipamento.id,
            tipo=evento.tipo,
            descricao=evento.descricao,
            data=evento.data,
            situacao_manutencao=evento.situacao_manutencao,
            motivo=evento.motivo,
            observacao=evento.observacao,
            data_conclusao=evento.data_conclusao,
            localizacao=evento.localizacao,
            responsavel=evento.responsavel,
            status=evento.status
        )

        db.add(novo_historico)

    db.commit()

    resultado = {
        "id": novo_equipamento.id,
        "tipo": novo_equipamento.tipo,
        "fabricante": novo_equipamento.fabricante,
        "modelo": novo_equipamento.modelo,
        "marca": novo_equipamento.marca,
        "numero_serie": novo_equipamento.numero_serie,
        "data_fabricacao": novo_equipamento.data_fabricacao,
        "status": novo_equipamento.status,
        "responsavel": novo_equipamento.responsavel,
        "setor": novo_equipamento.setor,
        "localizacao": novo_equipamento.localizacao
    }

    db.close()

    return {
        "mensagem": "Equipamento cadastrado com sucesso!",
        "equipamento": resultado
    }


@app.post("/manutencoes")
def criar_manutencao(manutencao: Manutencao):
    db = SessionLocal()

    equipamento = db.query(EquipamentoDB).filter(
        EquipamentoDB.id == manutencao.equipamento_id
    ).first()

    if not equipamento:
        db.close()

        return {
            "erro": "Equipamento não encontrado!"
        }

    nova_manutencao = ManutencaoDB(
        equipamento_id=manutencao.equipamento_id,
        data=manutencao.data,
        situacao=manutencao.situacao,
        motivo=manutencao.motivo,
        observacao=manutencao.observacao,
        data_conclusao=manutencao.data_conclusao
    )

    db.add(nova_manutencao)
    db.commit()
    db.refresh(nova_manutencao)

    resultado = {
        "id": nova_manutencao.id,
        "equipamento_id": nova_manutencao.equipamento_id,
        "data": nova_manutencao.data,
        "situacao": nova_manutencao.situacao,
        "motivo": nova_manutencao.motivo,
        "observacao": nova_manutencao.observacao,
        "data_conclusao": nova_manutencao.data_conclusao
    }

    db.close()

    return {
        "mensagem": "Manutenção cadastrada com sucesso!",
        "manutencao": resultado
    }


@app.post("/equipamentos/{equipamento_id}/anexos")
def enviar_anexo(
    equipamento_id: int,
    arquivo: UploadFile = File(...)
):
    tamanho_maximo = 10 * 1024 * 1024

    extensoes_permitidas = {
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx"
    }

    nome_arquivo = os.path.basename(
        arquivo.filename
    )

    if not nome_arquivo:
        return {
            "erro": "Nome de arquivo inválido!"
        }

    arquivo.file.seek(
        0,
        os.SEEK_END
    )

    tamanho_arquivo = arquivo.file.tell()

    arquivo.file.seek(0)

    if tamanho_arquivo > tamanho_maximo:
        return {
            "erro": "O arquivo é muito grande! O tamanho máximo permitido é 10 MB."
        }

    extensao = os.path.splitext(
        nome_arquivo
    )[1].lower()

    if extensao not in extensoes_permitidas:
        return {
            "erro": "Tipo de arquivo não permitido!"
        }

    db = SessionLocal()

    equipamento = db.query(EquipamentoDB).filter(
        EquipamentoDB.id == equipamento_id
    ).first()

    if not equipamento:
        db.close()

        return {
            "erro": "Equipamento não encontrado!"
        }

    pasta_anexos = "anexos"

    os.makedirs(
        pasta_anexos,
        exist_ok=True
    )

    nome_unico = (
        f"{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}_"
        f"{nome_arquivo}"
    )

    caminho_arquivo = os.path.join(
        pasta_anexos,
        nome_unico
    )

    with open(
        caminho_arquivo,
        "wb"
    ) as destino:
        shutil.copyfileobj(
            arquivo.file,
            destino
        )

    novo_anexo = AnexoDB(
        equipamento_id=equipamento_id,
        nome_arquivo=nome_arquivo,
        caminho_arquivo=caminho_arquivo,
        tipo_arquivo=arquivo.content_type,
        data_upload=datetime.now().isoformat()
    )

    db.add(novo_anexo)
    db.commit()
    db.refresh(novo_anexo)

    novo_historico = HistoricoDB(
        equipamento_id=equipamento_id,
        tipo="Anexo",
        descricao=f"Anexo adicionado: {nome_arquivo}",
        data=novo_anexo.data_upload,
        anexo_id=novo_anexo.id
    )

    db.add(novo_historico)
    db.commit()
    db.refresh(novo_historico)

    resultado = {
        "id": novo_anexo.id,
        "equipamento_id": novo_anexo.equipamento_id,
        "nome_arquivo": novo_anexo.nome_arquivo,
        "tipo_arquivo": novo_anexo.tipo_arquivo,
        "data_upload": novo_anexo.data_upload
    }

    db.close()

    return {
        "mensagem": "Anexo enviado com sucesso!",
        "anexo": resultado
    }


@app.get("/equipamentos/{equipamento_id}/anexos")
def listar_anexos(equipamento_id: int):
    db = SessionLocal()

    equipamento = db.query(EquipamentoDB).filter(
        EquipamentoDB.id == equipamento_id
    ).first()

    if not equipamento:
        db.close()

        return {
            "erro": "Equipamento não encontrado!"
        }

    anexos = db.query(AnexoDB).filter(
        AnexoDB.equipamento_id == equipamento_id
    ).all()

    resultado = []

    for anexo in anexos:
        resultado.append({
            "id": anexo.id,
            "equipamento_id": anexo.equipamento_id,
            "nome_arquivo": anexo.nome_arquivo,
            "caminho_arquivo": anexo.caminho_arquivo,
            "tipo_arquivo": anexo.tipo_arquivo,
            "data_upload": anexo.data_upload
        })

    db.close()

    return resultado

@app.get("/anexos/{anexo_id}")
def baixar_anexo(anexo_id: int):
    db = SessionLocal()

    anexo = db.query(AnexoDB).filter(
        AnexoDB.id == anexo_id
    ).first()

    if not anexo:
        db.close()

        return {
            "erro": "Anexo não encontrado!"
        }

    caminho_arquivo = anexo.caminho_arquivo

    db.close()

    if not os.path.exists(caminho_arquivo):
        return {
            "erro": "Arquivo não encontrado no servidor!"
        }

    return FileResponse(
        caminho_arquivo,
        media_type=anexo.tipo_arquivo
    )


@app.delete("/anexos/{anexo_id}")
def excluir_anexo(anexo_id: int):
    criar_backup_banco()

    db = SessionLocal()

    anexo = db.query(AnexoDB).filter(
        AnexoDB.id == anexo_id
    ).first()

    if not anexo:
        db.close()

        return {
            "erro": "Anexo não encontrado!"
        }

    caminho_arquivo = anexo.caminho_arquivo

    historico = db.query(HistoricoDB).filter(
        HistoricoDB.anexo_id == anexo_id
    ).first()

    if historico:
        db.delete(historico)

    db.delete(anexo)

    db.commit()
    db.close()

    if os.path.exists(caminho_arquivo):
        os.remove(caminho_arquivo)

    return {
        "mensagem": "Anexo excluído com sucesso!"
    }