import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MappingService } from '../mapping.service';

import { CurationManageComponent } from './curation-manage.component';

const mappingServiceStub = {
  getManagedTerms: () => {
    return {
      subscribe: () => { }
    };
  },
  getStringDataBusSubject: () => {
    return {
      subscribe: () => { }
    };
  },
  getCurationSummary: () => {
    return {
      subscribe: () => { }
    };
  },
  exportUrl: '',
};

describe('CurationManageComponent', () => {
  let component: CurationManageComponent;
  let fixture: ComponentFixture<CurationManageComponent>;
  let de: DebugElement;
  let mappingService: MappingService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CurationManageComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [{ provide: MappingService, useValue: mappingServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationManageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    mappingService = de.injector.get(MappingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
