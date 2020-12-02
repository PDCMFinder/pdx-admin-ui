import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { DatasourceSummaryComponent } from './datasource-summary.component';

describe('DatasourceSummaryComponent', () => {
  let component: DatasourceSummaryComponent;
  let fixture: ComponentFixture<DatasourceSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DatasourceSummaryComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        MatProgressSpinnerModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
