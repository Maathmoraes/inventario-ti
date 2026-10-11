from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker


DATABASE_URL = "sqlite:///./inventario.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()

class Equipamento(Base):
    __tablename__ = "equipamentos"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String)
    fabricante = Column(String)
    modelo = Column(String)
    marca = Column(String)
    numero_serie = Column(String)
    data_fabricacao = Column(String)
    status = Column(String)
    responsavel = Column(String)
    setor = Column(String)
    localizacao = Column(String)
    ativo = Column(Integer, default=1)


class Historico(Base):
    __tablename__ = "historico"

    id = Column(Integer, primary_key=True, index=True)
    equipamento_id = Column(Integer)
    tipo = Column(String)
    descricao = Column(String)
    data = Column(String)
    situacao_manutencao = Column(String)
    motivo = Column(String)
    observacao = Column(String)
    data_conclusao = Column(String)
    localizacao = Column(String)
    responsavel = Column(String)
    status = Column(String)
    anexo_id = Column(Integer)


class Manutencao(Base):
    __tablename__ = "manutencoes"

    id = Column(Integer, primary_key=True, index=True)
    equipamento_id = Column(Integer)
    data = Column(String)
    situacao = Column(String)
    motivo = Column(String)
    observacao = Column(String)
    data_conclusao = Column(String)


class Anexo(Base):
    __tablename__ = "anexos"

    id = Column(Integer, primary_key=True, index=True)
    equipamento_id = Column(Integer)
    nome_arquivo = Column(String)
    caminho_arquivo = Column(String)
    tipo_arquivo = Column(String)
    data_upload = Column(String)


Base.metadata.create_all(bind=engine)