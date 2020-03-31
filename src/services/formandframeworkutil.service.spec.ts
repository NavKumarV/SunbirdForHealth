import { FormAndFrameworkUtilService } from './formandframeworkutil.service';
import { ProfileService,
  SystemSettingsService,
  FrameworkUtilService,
  FormService,
  FrameworkService,
  SharedPreferences,
  ProfileType,
  ProfileSource } from 'sunbird-sdk';
import { AppGlobalService } from './app-global-service.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Events } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import {
  mockWebviewFormResponse,
  mockExternalIdVerificationResponse,
  mockFAQSystemSettingsResponse,
  mockComingSoonMessageSystemSettingsResponse,
  mockCustodianOrIdResponse,
  mockTPDFrameworkIdResponse,
  mockWebsessionConfigResponse,
  mockLibraryFilterConfigResponse,
  mockCourseFilterConfigResponse,
  mockDialCodeConfigResponse,
  mockLocationConfigResponse,
  mockContentConfigResponse,
  mockforceUpgradeFormAPIResponse,
  mockCategoryTermsResponse
} from './formandframeworkutil.service.spec.data';


describe('FormAndFrameworkUtilService', () => {
  let formAndFrameworkUtilService: FormAndFrameworkUtilService;

  const mockProfileService: Partial<ProfileService> = {
    updateProfile: jest.fn(() => of({} as any))
  };
  const mockSystemSettingsService: Partial<SystemSettingsService> = {
    getSystemSettings: jest.fn()
  };
  const mockFrameworkUtilService: Partial<FrameworkUtilService> = {};
  const mockFormService: Partial<FormService> = {};
  const mockFrameworkService: Partial<FrameworkService> = {};
  const mockSharedPreferences: Partial<SharedPreferences> = {
    getString: jest.fn(() => of(''))
  };
  const mockAppGlobalService: Partial<AppGlobalService> = {
    setLibraryFilterConfig: jest.fn(),
    setCourseFilterConfig: jest.fn(),
    setDailCodeConfig: jest.fn(),
    setLocationConfig: jest.fn(),
    setRootOrganizations: jest.fn()
  };
  const mockAppVersion: Partial<AppVersion> = {
    getVersionCode: jest.fn(() => Promise.resolve(48))
  };
  const mockTranslateService: Partial<TranslateService> = {};
  const mockEvents: Partial<Events> = {
    publish: jest.fn()
  };

  beforeAll(() => {
    formAndFrameworkUtilService = new FormAndFrameworkUtilService(
      mockProfileService as ProfileService,
      mockSystemSettingsService as SystemSettingsService,
      mockFrameworkUtilService as FrameworkUtilService,
      mockFormService as FormService,
      mockFrameworkService as FrameworkService,
      mockSharedPreferences as SharedPreferences,
      mockAppGlobalService as AppGlobalService,
      mockAppVersion as AppVersion,
      mockTranslateService as TranslateService,
      mockEvents as Events
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of FormAndFrameworkUtilService', () => {
    expect(formAndFrameworkUtilService).toBeTruthy();
  });

  describe('getWebviewConfig()', () => {

    it('should return the webview version', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockWebviewFormResponse));
      // act
      // assert
      formAndFrameworkUtilService.getWebviewConfig().then((response) => {
        expect(response).toEqual(54);
        done();
      });
    });

    it('should return the webview version if value is not set', (done) => {
      // arrange
      const formResponse = {
        form: ''
      };
      mockFormService.getForm = jest.fn(() => of(formResponse));
      // act
      // assert
      formAndFrameworkUtilService.getWebviewConfig().then((response) => {
        expect(response).toEqual(54);
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService.getWebviewConfig().catch((error) => {
        expect(error).toEqual({ error: 'API_ERROR' });
        done();
      });
    });
  });

  describe('getTenantSpecificMessages()', () => {

    it('should return the tenantSpecific messages', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockExternalIdVerificationResponse));
      // act
      // assert
      formAndFrameworkUtilService.getTenantSpecificMessages('rootOrgId').then((response) => {
        expect(response[0]).toEqual({
          popupHeaderLabel: 'User Verification',
          headerLabel: 'Are you a government school teacher ?',
          fieldLabel: 'Enter your teacher ID for verification',
        });
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService.getTenantSpecificMessages('rootOrgId').catch((error) => {
        expect(error).toEqual({ error: 'API_ERROR' });
        done();
      });
    });
  });

  describe('getConsumptionFaqsUrl()', () => {

    it('should return the consumption FAQ url', (done) => {
      // arrange
      mockSystemSettingsService.getSystemSettings = jest.fn(() => of(mockFAQSystemSettingsResponse));
      // act
      // assert
      formAndFrameworkUtilService.getConsumptionFaqsUrl().then((response: string) => {
        expect(response).toBe('sample_url');
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockSystemSettingsService.getSystemSettings = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService.getConsumptionFaqsUrl().catch((error) => {
        expect(error).toEqual({ error: 'API_ERROR' });
        done();
      });
    });
  });

  describe('getContentComingSoonMsg()', () => {

    it('should return the Coming Soon Message', (done) => {
      // arrange
      mockSystemSettingsService.getSystemSettings = jest.fn(() => of(mockComingSoonMessageSystemSettingsResponse));
      // act
      // assert
      formAndFrameworkUtilService.getContentComingSoonMsg().then((response: string) => {
        expect(JSON.parse(response)[0].value).toBe('Org specific coming soon message');
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockSystemSettingsService.getSystemSettings = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService.getContentComingSoonMsg().catch((error) => {
        expect(error).toEqual({ error: 'API_ERROR' });
        done();
      });
    });
  });

  describe('getCustodianOrgId()', () => {

    it('should return the custodian orgid', (done) => {
      // arrange
      mockSystemSettingsService.getSystemSettings = jest.fn(() => of(mockCustodianOrIdResponse));
      // act
      // assert
      formAndFrameworkUtilService.getCustodianOrgId().then((response) => {
        expect(response).toBe('sample_custodianOrgId');
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockSystemSettingsService.getSystemSettings = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService.getCustodianOrgId().catch((error) => {
        expect(error).toEqual({ error: 'API_ERROR' });
        done();
      });
    });
  });

  describe('getCourseFrameworkId()', () => {

    it('should return the TPD frameworkid', (done) => {
      // arrange
      mockSystemSettingsService.getSystemSettings = jest.fn(() => of(mockTPDFrameworkIdResponse));
      // act
      // assert
      formAndFrameworkUtilService.getCourseFrameworkId().then((response) => {
        expect(response).toBe('sample_courseFrameworkId');
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockSystemSettingsService.getSystemSettings = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService.getCourseFrameworkId().catch((error) => {
        expect(error).toEqual({ error: 'API_ERROR' });
        done();
      });
    });
  });

  describe('getWebviewSessionProviderConfig()', () => {

    it('should return login websession config', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockWebsessionConfigResponse));
      // act
      // assert
      formAndFrameworkUtilService.getWebviewSessionProviderConfig('login').then((response) => {
        expect(response.context).toEqual('login');
        done();
      });
    });

    it('should return merge websession config', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockWebsessionConfigResponse));
      // act
      // assert
      formAndFrameworkUtilService.getWebviewSessionProviderConfig('migrate').then((response) => {
        expect(response.context).toEqual('migrate');
        done();
      });
    });

    it('should throw SignInError error if context not available', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockWebsessionConfigResponse));
      // act
      // assert
      formAndFrameworkUtilService.getWebviewSessionProviderConfig('merge').catch((error) => {
        expect(error.message).toEqual('SESSION_PROVIDER_CONFIG_NOT_FOUND');
        done();
      });
    });
  });

  describe('getLibraryFilterConfig()', () => {

    it('should invoke invokeLibraryFilterConfigFormApi if cached response is not available', (done) => {
      // arrange
      mockAppGlobalService.getCachedLibraryFilterConfig = jest.fn(() => undefined);
      mockFormService.getForm = jest.fn(() => of(mockLibraryFilterConfigResponse));
      jest.spyOn<any, any>(formAndFrameworkUtilService, 'invokeLibraryFilterConfigFormApi');
      // act
      // assert
      formAndFrameworkUtilService.getLibraryFilterConfig().then((response) => {
        expect(formAndFrameworkUtilService['invokeLibraryFilterConfigFormApi']).toHaveBeenCalled();
        done();
      });
    });

    it('should resolve  if cached response available', (done) => {
      // arrange
      mockAppGlobalService.getCachedLibraryFilterConfig = jest.fn(() => mockLibraryFilterConfigResponse.form.data.fields);
      // act
      // assert
      formAndFrameworkUtilService.getLibraryFilterConfig().then((response) => {
        expect(response.length).toEqual(5);
        done();
      });
    });
  });

  describe('invokeLibraryFilterConfigFormApi()', () => {

    it('should return library config', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockLibraryFilterConfigResponse));
      const resolve = jest.fn(() => Promise.resolve());
      const reject = jest.fn(() => Promise.reject());
      // act
      // assert
      formAndFrameworkUtilService['invokeLibraryFilterConfigFormApi']({} as any, resolve, reject);
      setTimeout(() => {
        expect(resolve).toHaveBeenCalledWith([
          {
            code: 'board',
            values: [],
            name: 'Board/Syllabus',
            index: 1
          },
          {
            code: 'gradeLevel',
            values: [],
            name: 'Class',
            index: 2
          },
          {
            code: 'subject',
            values: [],
            name: 'Subject',
            index: 3
          },
          {
            code: 'medium',
            values: [],
            name: 'Medium',
            index: 4
          },
          {
            code: 'contentType',
            values: [
              {
                code: 'Story',
                name: 'Story'
              }
            ],
            name: 'Resource Type',
            index: 5
          }
        ]);
        done();
      }, 0);
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      const resolve = jest.fn(() => Promise.resolve());
      const reject = jest.fn(() => Promise.resolve());
      // act
      // assert
      formAndFrameworkUtilService['invokeLibraryFilterConfigFormApi']({} as any, resolve, reject);
      setTimeout(() => {
        expect(resolve).toHaveBeenCalledWith({});
        done();
      }, 10);
    });
  });

  describe('getLibraryFilterConfig()', () => {

    it('should invoke invokeLibraryFilterConfigFormApi if cached response is not available', (done) => {
      // arrange
      mockAppGlobalService.getCachedLibraryFilterConfig = jest.fn(() => undefined);
      mockFormService.getForm = jest.fn(() => of(mockLibraryFilterConfigResponse));
      jest.spyOn<any, any>(formAndFrameworkUtilService, 'invokeLibraryFilterConfigFormApi');
      // act
      // assert
      formAndFrameworkUtilService.getLibraryFilterConfig().then((response) => {
        expect(formAndFrameworkUtilService['invokeLibraryFilterConfigFormApi']).toHaveBeenCalled();
        done();
      });
    });

    it('should resolve  if cached response available', (done) => {
      // arrange
      mockAppGlobalService.getCachedLibraryFilterConfig = jest.fn(() => mockLibraryFilterConfigResponse.form.data.fields);
      // act
      // assert
      formAndFrameworkUtilService.getLibraryFilterConfig().then((response) => {
        expect(response.length).toEqual(5);
        done();
      });
    });
  });

  describe('invokeLibraryFilterConfigFormApi()', () => {

    it('should return library config', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockLibraryFilterConfigResponse));
      const resolve = jest.fn(() => Promise.resolve());
      const reject = jest.fn(() => Promise.reject());
      // act
      // assert
      formAndFrameworkUtilService['invokeLibraryFilterConfigFormApi']({} as any, resolve, reject);
      setTimeout(() => {
        expect(resolve).toHaveBeenCalledWith([
          {
            code: 'board',
            values: [],
            name: 'Board/Syllabus',
            index: 1
          },
          {
            code: 'gradeLevel',
            values: [],
            name: 'Class',
            index: 2
          },
          {
            code: 'subject',
            values: [],
            name: 'Subject',
            index: 3
          },
          {
            code: 'medium',
            values: [],
            name: 'Medium',
            index: 4
          },
          {
            code: 'contentType',
            values: [
              {
                code: 'Story',
                name: 'Story'
              }
            ],
            name: 'Resource Type',
            index: 5
          }
        ]);
        done();
      }, 0);
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      const resolve = jest.fn(() => Promise.resolve());
      const reject = jest.fn(() => Promise.resolve());
      // act
      // assert
      formAndFrameworkUtilService['invokeLibraryFilterConfigFormApi']({} as any, resolve, reject);
      setTimeout(() => {
        expect(resolve).toHaveBeenCalledWith({});
        done();
      }, 10);
    });
  });

  describe('getCourseFilterConfig()', () => {

    it('should invoke invokeCourseFilterConfigFormApi if cached response is not available', (done) => {
      // arrange
      mockAppGlobalService.getCachedCourseFilterConfig = jest.fn(() => undefined);
      mockFormService.getForm = jest.fn(() => of(mockCourseFilterConfigResponse));
      jest.spyOn<any, any>(formAndFrameworkUtilService, 'invokeCourseFilterConfigFormApi');
      // act
      // assert
      formAndFrameworkUtilService.getCourseFilterConfig().then((response) => {
        expect(formAndFrameworkUtilService['invokeCourseFilterConfigFormApi']).toHaveBeenCalled();
        done();
      });
    });

    it('should resolve  if cached response available', (done) => {
      // arrange
      mockAppGlobalService.getCachedCourseFilterConfig = jest.fn(() => mockCourseFilterConfigResponse.form.data.fields);
      // act
      // assert
      formAndFrameworkUtilService.getCourseFilterConfig().then((response) => {
        expect(response.length).toEqual(2);
        done();
      });
    });
  });

  describe('invokeCourseFilterConfigFormApi()', () => {

    it('should return course config', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockCourseFilterConfigResponse));
      const resolve = jest.fn(() => Promise.resolve());
      const reject = jest.fn(() => Promise.reject());
      // act
      // assert
      formAndFrameworkUtilService['invokeCourseFilterConfigFormApi']({} as any, resolve, reject);
      setTimeout(() => {
        expect(resolve).toHaveBeenCalledWith([
          {
            code: 'board',
            values: [],
            name: 'Board/Syllabus',
            index: 1
          },
          {
            code: 'contentType',
            values: [
              {
                code: 'Story',
                name: 'Story'
              }
            ],
            name: 'Resource Type',
            index: 5
          }
        ]);
        done();
      }, 0);
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      const resolve = jest.fn(() => Promise.resolve());
      const reject = jest.fn(() => Promise.resolve());
      // act
      // assert
      formAndFrameworkUtilService['invokeCourseFilterConfigFormApi']({} as any, resolve, reject);
      setTimeout(() => {
        expect(resolve).toHaveBeenCalledWith({});
        done();
      }, 10);
    });
  });

  describe('getDailCodeConfig()', () => {

    it('should invoke invokeDialCodeFormApi() if cached response is not available', (done) => {
      // arrange
      mockAppGlobalService.getCachedDialCodeConfig = jest.fn(() => undefined);
      mockFormService.getForm = jest.fn(() => of(mockDialCodeConfigResponse));
      jest.spyOn<any, any>(formAndFrameworkUtilService, 'invokeDialCodeFormApi');
      // act
      // assert
      formAndFrameworkUtilService.getDailCodeConfig().then((response) => {
        expect(formAndFrameworkUtilService['invokeDialCodeFormApi']).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('invokeDialCodeFormApi()', () => {

    it('should return dialcode config', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockDialCodeConfigResponse));
      // act
      // assert
      formAndFrameworkUtilService['invokeDialCodeFormApi']();
      setTimeout(() => {
        expect(mockAppGlobalService.setDailCodeConfig).toHaveBeenCalledWith('sample_regex');
        done();
      }, 0);
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService['invokeDialCodeFormApi']();
      setTimeout(() => {
        expect(mockAppGlobalService.setDailCodeConfig).not.toHaveBeenCalledWith('sample_regex');
        done();
      }, 0);
    });
  });

  describe('getLocationConfig()', () => {

    it('should invoke invokeLocationConfigFormApi if cached response is not available', (done) => {
      // arrange
      mockAppGlobalService.getCachedLocationConfig = jest.fn(() => undefined);
      mockFormService.getForm = jest.fn(() => of(mockLocationConfigResponse));
      jest.spyOn<any, any>(formAndFrameworkUtilService, 'invokeLocationConfigFormApi');
      // act
      // assert
      formAndFrameworkUtilService.getLocationConfig().then((response) => {
        expect(formAndFrameworkUtilService['invokeLocationConfigFormApi']).toHaveBeenCalled();
        done();
      });
    });

    it('should resolve  if cached response available', (done) => {
      // arrange
      mockAppGlobalService.getCachedLocationConfig = jest.fn(() => mockLocationConfigResponse.form.data.fields);
      // act
      // assert
      formAndFrameworkUtilService.getLocationConfig().then((response) => {
        expect(response).toEqual([{
          name: 'Skip Location',
          code: 'skip',
          values: []
        }]);
        done();
      });
    });
  });

  describe('invokeLocationConfigFormApi()', () => {

    it('should return location config', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockLocationConfigResponse));
      const resolve = jest.fn(() => Promise.resolve());
      const reject = jest.fn(() => Promise.reject());
      // act
      // assert
      formAndFrameworkUtilService['invokeLocationConfigFormApi']({} as any, resolve, reject);
      setTimeout(() => {
        expect(resolve).toHaveBeenCalledWith([
          {
            name: 'Skip Location',
            code: 'skip',
            values: []
          }]);
        done();
      }, 0);
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      const resolve = jest.fn(() => Promise.resolve());
      const reject = jest.fn(() => Promise.resolve());
      // act
      // assert
      formAndFrameworkUtilService['invokeLocationConfigFormApi']({} as any, resolve, reject);
      setTimeout(() => {
        expect(resolve).toHaveBeenCalledWith({});
        done();
      }, 10);
    });
  });

  describe('init()', () => {

    it('should invoke getDailCodeConfig', (done) => {
      // arrange
      jest.spyOn(formAndFrameworkUtilService, 'getDailCodeConfig');
      // act
      // assert
      formAndFrameworkUtilService.init();
      setTimeout((() => {
        expect(formAndFrameworkUtilService.getDailCodeConfig).toHaveBeenCalled();
        done();
      }), 0);
    });
  });

  describe('invokeContentFilterConfigFormApi()', () => {

    it('should return content config', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockContentConfigResponse));
      // act
      // assert
      formAndFrameworkUtilService.invokeContentFilterConfigFormApi().then((response) => {
        expect(response[0].values.length).toEqual(5);
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService.invokeContentFilterConfigFormApi().then((error) => {
        expect(error).toEqual({ error: 'API_ERROR' });
        done();
      });
    });
  });

  describe('getSupportedContentFilterConfig()', () => {

    it('should invokeContentFilterConfigFormApi() and return content config', (done) => {
      // arrange
      formAndFrameworkUtilService['getCachedContentFilterConfig'] = jest.fn(() => undefined);
      formAndFrameworkUtilService['invokeContentFilterConfigFormApi'] = jest.fn(() =>
        Promise.resolve(mockContentConfigResponse.form.data.fields));
      // act
      // assert
      formAndFrameworkUtilService.getSupportedContentFilterConfig('library').then((response) => {
        expect(response).toEqual(['Resource', 'Collection', 'TextBook', 'LessonPlan', 'Course']);
        done();
      });
    });

    it('should return content config for library if invokeContentFilterConfigFormApi() API fails', (done) => {
      // arrange
      formAndFrameworkUtilService['getCachedContentFilterConfig'] = jest.fn(() => undefined);
      formAndFrameworkUtilService['invokeContentFilterConfigFormApi'] = jest.fn(() =>
        Promise.resolve([]));
      // act
      // assert
      formAndFrameworkUtilService.getSupportedContentFilterConfig('library').then((response) => {
        expect(response).toEqual(['Story', 'Worksheet', 'Game', 'Resource', 'Collection', 'TextBook', 'LessonPlan']);
        done();
      });
    });

    it('should return content config for course if invokeContentFilterConfigFormApi() API fails', (done) => {
      // arrange
      formAndFrameworkUtilService['getCachedContentFilterConfig'] = jest.fn(() => undefined);
      formAndFrameworkUtilService['invokeContentFilterConfigFormApi'] = jest.fn(() =>
        Promise.resolve([]));
      // act
      // assert
      formAndFrameworkUtilService.getSupportedContentFilterConfig('course').then((response) => {
        expect(response).toEqual(['Course']);
        done();
      });
    });

    it('should return content config for downloads if invokeContentFilterConfigFormApi() API fails', (done) => {
      // arrange
      formAndFrameworkUtilService['getCachedContentFilterConfig'] = jest.fn(() => undefined);
      formAndFrameworkUtilService['invokeContentFilterConfigFormApi'] = jest.fn(() =>
        Promise.resolve([]));
      // act
      // assert
      formAndFrameworkUtilService.getSupportedContentFilterConfig('downloads').then((response) => {
        expect(response).toEqual(['Story', 'Worksheet', 'Game', 'Resource', 'Collection', 'TextBook', 'LessonPlan', 'Course', 'FocusSpot',
          'LearningOutcomeDefinition',
          'PracticeQuestionSet',
          'CuriosityQuestions',
          'MarkingSchemeRubric',
          'ExplanationResource',
          'ExperientialResource']);
        done();
      });
    });

    it('should return content config for dialcode if invokeContentFilterConfigFormApi() API fails', (done) => {
      // arrange
      formAndFrameworkUtilService['getCachedContentFilterConfig'] = jest.fn(() => undefined);
      formAndFrameworkUtilService['invokeContentFilterConfigFormApi'] = jest.fn(() =>
        Promise.resolve([]));
      // act
      // assert
      formAndFrameworkUtilService.getSupportedContentFilterConfig('dialcode').then((response) => {
        expect(response).toEqual(['TextBook', 'TextBookUnit', 'Course']);
        expect(formAndFrameworkUtilService['getCachedContentFilterConfig']()).toBeUndefined();
        done();
      });
    });

  });

  describe('getRootOrganizations()', () => {

    it('should invoke searchOrganization() API and return org list', (done) => {
      // arrange
      mockAppGlobalService.getCachedRootOrganizations = jest.fn(() => undefined);
      mockFrameworkService.searchOrganization = jest.fn(() => of({ content: ['sample_org'] } as any));
      // act
      formAndFrameworkUtilService.getRootOrganizations();
      // assert
      setTimeout(() => {
        expect(mockAppGlobalService.setRootOrganizations).toHaveBeenCalledWith(['sample_org']);
        done();
      }, 0);
    });

    it('should return the cache version if cache is available', (done) => {
      // arrange
      const searchOrgResponse = { content: ['sample_org'] } as any;
      mockAppGlobalService.getCachedRootOrganizations = jest.fn(() => searchOrgResponse);
      // act
      // assert
      formAndFrameworkUtilService.getRootOrganizations().then((response) => {
        expect(response).toEqual({ content: ['sample_org'] });
        done();
      });
    });
  });

  describe('checkNewAppVersion()', () => {

    it('should return forceupgrade types', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => of(mockforceUpgradeFormAPIResponse));
      // act
      // assert
      formAndFrameworkUtilService.checkNewAppVersion().then((response) => {
        expect(response).toEqual(
          {
            actionButtons: [{
              action: 'yes', label: 'Update Now',
              link: 'https://play.google.com/store/apps/details?id=org.sunbird.app&hl=en'
            }],
            desc: '', title: 'Sample_title', type: 'forced',
            currentAppVersionCode: 48,
            maxVersionCode: 52,
            minVersionCode: 13
          }
        );
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockFormService.getForm = jest.fn(() => throwError({ error: 'API_ERROR' }));
      // act
      // assert
      formAndFrameworkUtilService.checkNewAppVersion().catch((error) => {
        expect(error).toEqual({ error: 'API_ERROR' });
        done();
      });
    });
  });

  describe('updateProfileInfo()', () => {

    it('should update the profile information successfully', (done) => {
      // arrange
      mockProfileService.updateProfile = jest.fn(() => of({ medium: ['English'], grade: ['class1']} as any));
      const profile = { syllabus: ['tn'], board: ['tn', 'ap'], medium: ['English'], grade: ['class1'] };
      const profileData = { profileType: ProfileType.TEACHER, source: ProfileSource.SERVER };
      // act
      // assert
      formAndFrameworkUtilService.updateProfileInfo(profile, profileData).then((response) => {
        expect(mockEvents.publish).toHaveBeenCalledWith('refresh:loggedInProfile');
        expect(response).toEqual({ status: true });
        done();
      });
    });

    it('should update the profile information successfully and send the response back', (done) => {
      // arrange
      mockProfileService.updateProfile = jest.fn(() => of({ grade: ['class1']} as any));
      const profile = { syllabus: ['tn'], board: ['tn', 'ap'], medium: ['English'], grade: ['class1'] };
      const profileData = { profileType: ProfileType.TEACHER, source: ProfileSource.SERVER };
      // act
      // assert
      formAndFrameworkUtilService.updateProfileInfo(profile, profileData).then((response) => {
        expect(mockEvents.publish).toHaveBeenCalledWith('refresh:loggedInProfile');
        expect(response).toEqual({ status: false, profile: { grade: ['class1']} });
        done();
      });
    });

    it('should reject the error if API throws some error', (done) => {
      // arrange
      mockProfileService.updateProfile = jest.fn(() => throwError({ error: 'API_ERROR' }));
      const profile = { syllabus: ['tn'], board: ['tn', 'ap'], medium: ['English'], grade: ['class1'] };
      const profileData = { profileType: ProfileType.TEACHER, source: ProfileSource.SERVER };
      // act
      // assert
      formAndFrameworkUtilService.updateProfileInfo(profile, profileData).then((response) => {
        expect(response).toEqual({ status: false });
        done();
      });
    });
  });

  describe('updateLoggedInUser()', () => {

    it('should update logged in user information successfully', (done) => {
      // arrange
      mockFrameworkUtilService.getFrameworkCategoryTerms = jest.fn(() => of(mockCategoryTermsResponse));
      mockProfileService.updateProfile = jest.fn(() => of({ medium: ['English'], grade: ['class1']} as any));
      const profile = { syllabus: ['tn'], board: ['tn', 'ap'], medium: ['English'], grade: ['class1'] };
      const profileRes = { framework: {
        gradeLevel : [
          'Class 1'
       ],
        subject : [
          'Telugu'
       ],
        id : [
          'ts_k-12_2'
       ],
        medium : [
          'English'
       ],
        board : [
          'State (Andhra Pradesh)'
       ]
     }};
      // act
      // assert
      formAndFrameworkUtilService.updateLoggedInUser(profileRes, profile).then((response) => {
        expect(response).toEqual({ status: true });
        done();
      });
    });

    it('should update logged in user information successfully if getFramework API fails', (done) => {
      // arrange
      mockFrameworkUtilService.getFrameworkCategoryTerms = jest.fn(() =>  throwError({ error: 'API_ERROR' }));
      mockProfileService.updateProfile = jest.fn(() => of({ medium: ['English'], grade: ['class1']} as any));
      const profile = { syllabus: ['tn'], board: ['tn', 'ap'], medium: ['English'], grade: ['class1'] };
      const profileRes = { framework: {
        gradeLevel : [
          'Class 1'
       ],
        subject : [
          'Telugu'
       ],
        id : [
          'ts_k-12_2'
       ],
        medium : [
          'English'
       ],
        board : [
          'State (Andhra Pradesh)'
       ]
     }};
      // act
      // assert
      formAndFrameworkUtilService.updateLoggedInUser(profileRes, profile).then((response) => {
        expect(response).toEqual({ status: true });
        done();
      });
    });

    it('should resolve if  framework info is not available', (done) => {
      // arrange
      mockFrameworkUtilService.getFrameworkCategoryTerms = jest.fn(() =>  throwError({ error: 'API_ERROR' }));
      mockProfileService.updateProfile = jest.fn(() => of({ medium: ['English'], grade: ['class1']} as any));
      const profile = { syllabus: ['tn'], board: ['tn', 'ap'], medium: ['English'], grade: ['class1'] };
      const profileRes = { framework: {}};
      // act
      // assert
      formAndFrameworkUtilService.updateLoggedInUser(profileRes, profile).then((response) => {
        expect(response).toEqual({ status: false });
        done();
      });
    });
  });

});
