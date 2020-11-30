import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CurationOrphanComponent } from './curation-orphan.component';

describe('CurationOrphanComponent', () => {
  let component: CurationOrphanComponent;
  let fixture: ComponentFixture<CurationOrphanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurationOrphanComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationOrphanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
