import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MappingService } from '../mapping.service';

import { CurationMappingComponent } from './curation-mapping.component';

const mappingServiceStub = {
  getUnmappedTermsByType: () => {
    return {
      subscribe: () => { }
    };
  },
  getTermsByStatus: () => {
    return {
      subscribe: () => { }
    };
  }
};

describe('CurationMappingComponent', () => {
  let component: CurationMappingComponent;
  let fixture: ComponentFixture<CurationMappingComponent>;
  let de: DebugElement;
  let mappingService: MappingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurationMappingComponent ],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [{provide: MappingService, useValue: mappingServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationMappingComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    mappingService = de.injector.get(MappingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
