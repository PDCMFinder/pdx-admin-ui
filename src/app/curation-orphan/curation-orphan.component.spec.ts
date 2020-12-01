import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MappingService } from '../mapping.service';

import { CurationOrphanComponent } from './curation-orphan.component';

const mappingServiceStub = {
  getManagedTerms: () => {
    return {
      subscribe: () => {}
    };
  },
  getDataSubject: () => {
    return {
      subscribe: () => {}
    };
  },
  getStringDataBusSubject: () => {
    return {
      subscribe: () => {}
    };
  },
};

describe('CurationOrphanComponent', () => {
  let component: CurationOrphanComponent;
  let fixture: ComponentFixture<CurationOrphanComponent>;
  let de: DebugElement;
  let mappingService: MappingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurationOrphanComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [{provide: MappingService, useValue: mappingServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationOrphanComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    mappingService = de.injector.get(MappingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
