import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MappingService } from '../mapping.service';

import { CurationValidateComponent } from './curation-validate.component';

const mappingServiceStub = {
  pushFileToStorage: () => {
    return {
      subscribe: () => { }
    };
  }
};

describe('CurationValidateComponent', () => {
  let component: CurationValidateComponent;
  let fixture: ComponentFixture<CurationValidateComponent>;
  let de: DebugElement;
  let mappingService: MappingService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CurationValidateComponent ],
      imports: [
        HttpClientModule
      ],
      providers: [{ provide: MappingService, useValue: mappingServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationValidateComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    mappingService = de.injector.get(MappingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
