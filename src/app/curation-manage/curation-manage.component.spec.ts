import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CurationManageComponent } from './curation-manage.component';

describe('CurationManageComponent', () => {
  let component: CurationManageComponent;
  let fixture: ComponentFixture<CurationManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurationManageComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
