import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CurationArchiveComponent } from './curation-archive.component';

describe('CurationArchiveComponent', () => {
  let component: CurationArchiveComponent;
  let fixture: ComponentFixture<CurationArchiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CurationArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
