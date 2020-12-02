import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MappingService } from '../mapping.service';

import { DatasourceSpecificSuggestionsComponent } from './datasource-specific-suggestions.component';

const mappingServiceStub = {
  getMappingEntityById: () => {
    return {
      subscribe: () => { }
    };
  },
  stringDataBus: () => {
    return {
    };
  },
  componentsDataBus: () => {
    return {
    };
  },
  eventDataBus: () => {
    return {
    };
  },
};

describe('DatasourceSpecificSuggestionsComponent', () => {
  let component: DatasourceSpecificSuggestionsComponent;
  let fixture: ComponentFixture<DatasourceSpecificSuggestionsComponent>;
  let de: DebugElement;
  let mappingService: MappingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceSpecificSuggestionsComponent ],
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
    fixture = TestBed.createComponent(DatasourceSpecificSuggestionsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    mappingService = de.injector.get(MappingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
