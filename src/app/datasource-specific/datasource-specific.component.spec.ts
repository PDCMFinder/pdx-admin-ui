import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MappingService } from '../mapping.service';

import { DatasourceSpecificComponent } from './datasource-specific.component';

const mappingServiceStub = {
  getDataSubject: () => {
    return {
      subscribe: () => { }
    };
  },
  getStringDataBusSubject: () => {
    return {
      subscribe: () => { }
    };
  },
  getOLS: () => {
    return {
      subscribe: () => { }
    };
  },
  getTerms: () => {
    return {
      subscribe: () => { }
    };
  },
  updateEntity: () => {
    return {
      subscribe: () => { }
    };
  },
  eventDataSubject: {
    subscribe: () => {}
  },
  exportUrl: '',
};

describe('DatasourceSpecificComponent', () => {
  let component: DatasourceSpecificComponent;
  let fixture: ComponentFixture<DatasourceSpecificComponent>;
  let de: DebugElement;
  let mappingService: MappingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceSpecificComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [{ provide: MappingService, useValue: mappingServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceSpecificComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    mappingService = de.injector.get(MappingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
