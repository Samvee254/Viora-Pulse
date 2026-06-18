from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.ReportResponse)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    db_report = models.Report(
        location_id=report.location_id,
        utility_type=report.utility_type,
        status=report.status
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.get("/", response_model=list[schemas.ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()

@router.get("/{location_id}", response_model=list[schemas.ReportResponse])
def get_reports_by_location(location_id: int, db: Session = Depends(get_db)):
    reports = db.query(models.Report).filter(
        models.Report.location_id == location_id
    ).all()
    if not reports:
        raise HTTPException(status_code=404, detail="No reports found for this location")
    return reports
