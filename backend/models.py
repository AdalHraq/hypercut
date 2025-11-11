from sqlalchemy import Column, String, Text
from db import Base

class LinkDoc(Base):
    __tablename__ = "link_docs"
    id = Column(String, primary_key=True, index=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
