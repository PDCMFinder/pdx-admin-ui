import { getTestBed, TestBed } from '@angular/core/testing';
import { MappingService } from './mapping.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SummaryInterface } from './summary-interface';
import { Mapping, MappingInterface } from './mapping-interface';

describe('MappingService', () => {
  let injector: TestBed;
  let mappingService: MappingService;
  let httpMock: HttpTestingController;

  const mockedMapping: MappingInterface = {
        mappings: [],
        size: 0,
        totalElements: 1,
        totaPages: 2,
        page: 1,
        beginIndex: 0,
        endIndex: 1,
        currentIndex: 0
      };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MappingService]
    });
    injector = getTestBed();
    mappingService = injector.get(MappingService);
    httpMock = injector.get(HttpTestingController);
  });


  describe('#getCurationSummary', () => {
    it('should return an Observable<SummaryInterface[]>', () => {
      const mockedData: SummaryInterface[] = [
        { DataSource: 'dataSource1', Unmapped: 0, Mapped: 1 },
        { DataSource: 'dataSource2', Unmapped: 0, Mapped: 1 }
      ];

      mappingService.getCurationSummary('maptype').subscribe(summaries => {
        expect(summaries.length).toBe(2);
        expect(summaries).toEqual(mockedData);
      });

      const req = httpMock.expectOne(`http://localhost:8081/api/mappings/summary?entity-type=maptype`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedData);
    });
  });

  describe('#getTerms', () => {
    it('should return an Observable<MappingInterface>', () => {
      mappingService.getTerms('status', 'entityType', 'dataSource', '1', '1').subscribe(terms => {
        expect(terms).toEqual(mockedMapping);
      });

      const req = httpMock.expectOne(
        `http://localhost:8081/api/mappings?mq=datasource:dataSource&entity-type=entityType&status=status&page=1&size=1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedMapping);
    });
  });

  describe('#getUnmappedTermsByType', () => {
    it('should return an Observable<MappingInterface[]>', () => {
      mappingService.getUnmappedTermsByType('entityType').subscribe(terms => {
        expect(terms).toEqual(mockedMapping);
      });

      const req = httpMock.expectOne(`http://localhost:8081/api/mappings?entity-type=entityType&status=unmapped`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedMapping);
    });
  });

  describe('#getTermsByStatus', () => {
    it('should return an Observable<MappingInterface[]>', () => {
      mappingService.getTermsByStatus('status').subscribe(terms => {
        expect(terms).toEqual(mockedMapping);
      });

      const req = httpMock.expectOne(`http://localhost:8081/api/mappings?status=status`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedMapping);
    });
  });

  describe('#getManagedTerms', () => {
    it('should return an Observable<MappingInterface>', () => {
      mappingService.getManagedTerms('entityType', 'dataSource', 'page', 'size', 'status').subscribe(terms => {
        expect(terms).toEqual(mockedMapping);
      });

      const req = httpMock.expectOne(
        `http://localhost:8081/api/mappings?entity-type=entityType&page=page&size=size&status=status&mq=datasource:dataSource`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedMapping);
    });
  });

  describe('#getMappingEntityById', () => {
    it('should return an Observable<Mapping>', () => {
      const mockedData: Mapping = {
        entityId: 1,
        entityType: 'entityType',
        mappingLabels: ['mappingLabels'],
        mappedTermUrl: 'mappedTermUrl',
        mappingValues: {
          OriginTissue: 'OriginTissue',
          TumorType: 'TumorType',
          SampleDiagnosis: 'SampleDiagnosis',
          DataSource: 'DataSource'
        },
        mappedTermLabel: 'mappedTermLabel',
        mapType: 'mapType',
        justification: 'justification',
        status: 'status',
        suggestedMappings: ['suggestedMapping1']
      };

      mappingService.getMappingEntityById('1').subscribe(entity => {
        expect(entity).toEqual(mockedData);
      });

      const req = httpMock.expectOne(`http://localhost:8081/api/mappings/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedData);
    });
  });

  describe('#getOLS', () => {
    it('should return an Observable<any>', () => {
      const mockedData = {};

      mappingService.getOLS('entityType').subscribe(entity => {
        expect(entity).toEqual(mockedData);
      });

      const req = httpMock.expectOne(`http://localhost:8081/api/mappings/ontologies?type=entityType`);
      expect(req.request.method).toBe('GET');
      req.flush(mockedData);
    });
  });

  describe('#updateEntity', () => {
    it('should return an Observable<MappingInterface>', () => {
      const mockedData: Mapping[] = [
        {
          entityId: 1,
          entityType: 'entityType',
          mappingLabels: ['mappingLabels'],
          mappedTermUrl: 'mappedTermUrl',
          mappingValues: {
            OriginTissue: 'OriginTissue',
            TumorType: 'TumorType',
            SampleDiagnosis: 'SampleDiagnosis',
            DataSource: 'DataSource'
          },
          mappedTermLabel: 'mappedTermLabel',
          mapType: 'mapType',
          justification: 'justification',
          status: 'status',
          suggestedMappings: ['suggestedMapping1']

        }];

      mappingService.updateEntity(mockedData).subscribe(terms => {
        expect(terms).toEqual(mockedData);
      });

      const req = httpMock.expectOne(`http://localhost:8081/api/mappings`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockedData);
    });
  });

  describe('#pushFileToStorage', () => {
    it('should return an Observable<HttpEvent>', () => {
      const mockedData = {};
      const currentFileUpload: File = null;

      mappingService.pushFileToStorage(currentFileUpload, 'entityType').subscribe(entity => {
        expect(entity).toBeDefined();
      });

      const req = httpMock.expectOne(`http://localhost:8081/api/mappings/uploads?entity-type=entityType`);
      expect(req.request.method).toBe('POST');
      req.flush(mockedData);
    });
  });

});


