import { MimeType, ContentType, RouterLinks, EventTopics } from '@app/app/app.constant';
import { ContentPlayerHandler } from './../../services/content/player/content-player-handler';
import { RatingHandler } from './../../services/rating/rating-handler';
import { QrcoderesultPage } from './qrcoderesult.page';
import {
    FrameworkService,
    FrameworkUtilService,
    ProfileService,
    SharedPreferences,
    DeviceRegisterService,
    ContentService,
    EventsBusService,
    PlayerService,
    DownloadEventType,
    ContentEventType
} from 'sunbird-sdk';
import { TranslateService } from '@ngx-translate/core';
import { Events, Platform, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import {
    AppGlobalService,
    TelemetryGeneratorService,
    CommonUtilService,
    SunbirdQRScanner,
    ContainerService,
    AppHeaderService
} from 'services';
import { SplashScreenService } from '@app/services/splash-screen.service';
import { Scanner } from 'typescript';
import { Location } from '@angular/common';
import { ImpressionType, PageId, Environment, InteractSubtype, InteractType } from '@app/services/telemetry-constants';
import { of, Subscription, throwError } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgZone } from '@angular/core';
import { CanvasPlayerService } from '../../services';
import { File } from '@ionic-native/file/ngx';
import { TextbookTocService } from '../collection-detail-etb/textbook-toc-service';

describe('QrcoderesultPage', () => {
    let qrcoderesultPage: QrcoderesultPage;
    const mockAppGlobalService: Partial<AppGlobalService> = {
        generateSaveClickedTelemetry: jest.fn()
    };
    const mockCommonUtilService: Partial<CommonUtilService> = {
        translateMessage: jest.fn(() => 'select-box'),
        convertFileSrc: jest.fn(() => 'img'),
        showContentComingSoonAlert: jest.fn(),
        showToast: jest.fn()
    };
    const mockEvents: Partial<Events> = {
        unsubscribe: jest.fn()
    };
    const mockFrameworkService: Partial<FrameworkService> = {};
    const mockFrameworkUtilService: Partial<FrameworkUtilService> = {};
    const mockHeaderService: Partial<AppHeaderService> = {
        hideHeader: jest.fn()
    };
    const mockLocation: Partial<Location> = {
        back: jest.fn()
    };
    const mockPlatform: Partial<Platform> = {};
    const mockProfileService: Partial<ProfileService> = {};
    const mockRouter: Partial<Router> = {
        getCurrentNavigation: jest.fn(() => undefined),
        navigate: jest.fn(() => Promise.resolve(true))
    };
    const mockTelemetryGeneratorService: Partial<TelemetryGeneratorService> = {
        generateInteractTelemetry: jest.fn(),
        generateImpressionTelemetry: jest.fn(),
        generateBackClickedTelemetry: jest.fn()
    };
    const mockTranslate: Partial<TranslateService> = {};
    const mockContentService: Partial<ContentService> = {};
    const mockEventsBusService: Partial<EventsBusService> = {};
    const mockPlayerService: Partial<PlayerService> = {};
    const mockZone: Partial<NgZone> = {
        run: jest.fn((fn) => fn())
    };
    const mockCanvasPlayerService: Partial<CanvasPlayerService> = {};
    const mockFile: Partial<File> = {};

    const mockNavCtrl: Partial<NavController> = {
        navigateForward: jest.fn(() => Promise.resolve(true))
    };
    const mockRatingHandler: Partial<RatingHandler> = {};
    const mockContentPlayerHandler: Partial<ContentPlayerHandler> = {};
    const mockTextbookTocService: Partial<TextbookTocService> = {
        textbookIds: {
            unit: 'sampleUnit',
            contentId: undefined,
            rootUnitId: undefined,
        },
        resetTextbookIds: jest.fn()
    };

    beforeAll(() => {
        qrcoderesultPage = new QrcoderesultPage(
            mockContentService as ContentService,
            mockProfileService as ProfileService,
            mockFrameworkService as FrameworkService,
            mockFrameworkUtilService as FrameworkUtilService,
            mockEventsBusService as EventsBusService,
            mockPlayerService as PlayerService,
            mockZone as NgZone,
            mockTranslate as TranslateService,
            mockPlatform as Platform,
            mockTelemetryGeneratorService as TelemetryGeneratorService,
            mockAppGlobalService as AppGlobalService,
            mockEvents as Events,
            mockCommonUtilService as CommonUtilService,
            mockCanvasPlayerService as CanvasPlayerService,
            mockLocation as Location,
            mockFile as File,
            mockHeaderService as AppHeaderService,
            mockRouter as Router,
            mockNavCtrl as NavController,
            mockRatingHandler as RatingHandler,
            mockContentPlayerHandler as ContentPlayerHandler,
            mockTextbookTocService as TextbookTocService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of qrcoderesultPage', () => {
        expect(qrcoderesultPage).toBeTruthy();
    });

    describe('ionViewWillEnter', () => {
        beforeEach(() => {
            qrcoderesultPage.navData = {
                content: {identifier: 'id'},
            };
            const data = jest.fn();
            const subscribeWithPriorityData = jest.fn((_, fn) => fn());
            mockPlatform.backButton = {
                subscribeWithPriority: subscribeWithPriorityData,

            } as any;
            qrcoderesultPage.unregisterBackButton = {
                unsubscribe: data
            }as any;
            const headerData = jest.fn((fn => fn()));
            mockHeaderService.headerEventEmitted$ = {
                subscribe: headerData
            }as any;
            mockHeaderService.showHeaderWithBackButton = jest.fn();
            jest.spyOn(qrcoderesultPage, 'handleHeaderEvents').mockImplementation(() => {
                return;
            });
        });
        it('should assign varaibles from navigation extras', (done) => {
            // arrange
            // qrcoderesultPage.getFirstChildOfChapter.and.stub();
            const unit = {
                identifier: 'parentid',
                contentData: {identifier: 'parentid'},
                mimeType: MimeType.COLLECTION,
                children: [{identifier: 'childid', basePath: 'basePath'}]
            };
            mockTextbookTocService.textbookIds = { unit : {
                identifier: 'parentid',
                contentData: {identifier: 'parentid'},
                mimeType: MimeType.COLLECTION,
                children: [{identifier: 'childid', basePath: 'basePath'}]
            }} as any;
            const scrollObj = {
                scrollTo: jest.fn()
            };
            qrcoderesultPage.ionContent = {
                getScrollElement: jest.fn(() => Promise.resolve(scrollObj))
            } as any;
            // spyOn(qrcoderesultPage, 'getFirstChildOfChapter').and.stub();
            spyOn(qrcoderesultPage, 'handleBackButton').and.stub();
            spyOn(qrcoderesultPage, 'getChildContents').and.stub();
            spyOn(qrcoderesultPage, 'subscribeSdkEvent').and.stub();
            // qrcoderesultPage.chapterFirstChildId = 'id';
            spyOn(document, 'getElementById').and.returnValue('element');
            // act
            qrcoderesultPage.ionViewWillEnter();
            // assert
            expect(mockHeaderService.hideHeader).toHaveBeenCalled();
            expect(qrcoderesultPage.content).toEqual({identifier: 'id'});
            setTimeout(() => {
                expect(mockTextbookTocService.resetTextbookIds).toHaveBeenCalled();
                done();
            }, 200);
        });
    });

    describe('ionViewWillLeave', () => {
        it('should unsubscribe the subscriptions', () => {
            // arrange
            qrcoderesultPage.headerObservable = {
                unsubscribe: jest.fn()
            };
            qrcoderesultPage.unregisterBackButton = {
                unsubscribe: jest.fn()
            };
            qrcoderesultPage.eventSubscription = {
                unsubscribe: jest.fn()
            } as any;
            // act
            qrcoderesultPage.ionViewWillLeave();
            // assert
            expect(qrcoderesultPage.downloadProgress).toEqual(0);
            expect(qrcoderesultPage.eventSubscription.unsubscribe).toHaveBeenCalled();
            expect(qrcoderesultPage.unregisterBackButton.unsubscribe).toHaveBeenCalled();
            expect(qrcoderesultPage.headerObservable.unsubscribe).toHaveBeenCalled();
        });
    });

    describe('ionViewDidEnter', () => {
        beforeEach(() => {
            mockAppGlobalService.isProfileSettingsCompleted = false;
        });
        it('should generate telemetry', () => {
            // arrange
            spyOn(qrcoderesultPage, 'calculateAvailableUserCount').and.stub();
            // act
            qrcoderesultPage.ionViewDidEnter();
            // assert
            expect(mockTelemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(
                ImpressionType.VIEW,
                '',
                PageId.DIAL_CODE_SCAN_RESULT,
                Environment.ONBOARDING
            );
        });
    });

    describe('handleBackButton', () => {
        it('should go back to previous route', () => {
            // arrange
            mockAppGlobalService.isProfileSettingsCompleted = false;
            // spyOn(qrcoderesultPage, 'calculateAvailableUserCount').and.stub();
            spyOn(qrcoderesultPage, 'goBack').and.stub();
            // act
            qrcoderesultPage.handleBackButton(PageId.LIBRARY);
            // assert
            expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                InteractType.TOUCH,
                PageId.LIBRARY,
                Environment.ONBOARDING,
                PageId.DIAL_CODE_SCAN_RESULT);
            expect(qrcoderesultPage.goBack).toHaveBeenCalled();
        });
        it('should go back to tabs', (done) => {
            // arrange
            mockAppGlobalService.isProfileSettingsCompleted = true;
            qrcoderesultPage.isSingleContent = true;
            spyOn(qrcoderesultPage, 'goBack').and.stub();
            mockCommonUtilService.isDeviceLocationAvailable = jest.fn(() => Promise.resolve(true));
            // act
            qrcoderesultPage.handleBackButton();
            // assert
            expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                InteractType.TOUCH,
                InteractSubtype.NAV_BACK_CLICKED,
                Environment.ONBOARDING,
                PageId.DIAL_CODE_SCAN_RESULT);
            setTimeout(() => {
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 1000);
        });
        it('should call navigateForward', (done) => {
            // arrange
            mockAppGlobalService.isProfileSettingsCompleted = true;
            qrcoderesultPage.isSingleContent = true;
            spyOn(qrcoderesultPage, 'goBack').and.stub();
            mockCommonUtilService.isDeviceLocationAvailable = jest.fn(() => Promise.resolve(false));
            // act
            qrcoderesultPage.handleBackButton();
            // assert
            expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                InteractType.TOUCH,
                InteractSubtype.NAV_BACK_CLICKED,
                Environment.ONBOARDING,
                PageId.DIAL_CODE_SCAN_RESULT);
            setTimeout(() => {
                expect(mockNavCtrl.navigateForward).toHaveBeenCalled();
                done();
            }, 1000);
        });
        it('should go to profilesettings page', (done) => {
            // arrange
            mockAppGlobalService.isProfileSettingsCompleted = false;
            mockAppGlobalService.isGuestUser = true;
            qrcoderesultPage.isSingleContent = true;
            // spyOn(qrcoderesultPage, 'goBack').and.stub();
            // mockCommonUtilService.isDeviceLocationAvailable = jest.fn(() => Promise.resolve(false));
            // act
            qrcoderesultPage.handleBackButton();
            // assert
            expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                InteractType.TOUCH,
                InteractSubtype.NAV_BACK_CLICKED,
                Environment.ONBOARDING,
                PageId.DIAL_CODE_SCAN_RESULT);
            setTimeout(() => {
                expect(mockRouter.navigate).toHaveBeenCalled();
                done();
            }, 1000);
        });
    });

    describe('getChildContents', () => {
        it('should get child contents', (done) => {
            // arrange
            const content = {
                identifier: 'parentid',
                contentData: {identifier: 'parentid'},
                children: [
                    {identifier: 'childid', basePath: 'basePath', mimeType: 'content', contentData: {identifier: 'id2'}}
                ]
            };
            qrcoderesultPage.searchIdentifier = 'childid';
            qrcoderesultPage.identifier = 'sampleid';
            mockContentService.getChildContents = jest.fn(() => of(content as any));
            mockAppGlobalService.getCurrentUser = jest.fn(() => 'currentuser');
            mockZone.run = jest.fn((fn) => fn());
            // spyOn(qrcoderesultPage, 'calculateAvailableUserCount').and.stub();
            // act
            qrcoderesultPage.getChildContents();
            // assert
            expect(mockContentService.getChildContents).toHaveBeenCalled();
            setTimeout(() => {
                expect(qrcoderesultPage.backToPreviusPage).toEqual(false);
                expect(mockEvents.unsubscribe).toHaveBeenCalledWith(EventTopics.PLAYER_CLOSED);
                expect(mockNavCtrl.navigateForward).toHaveBeenCalledWith(
                    [RouterLinks.CONTENT_DETAILS],
                    expect.anything()
                );
                done();
            }, 0);
        });
        it('should call get child contents ', (done) => {
            // arrange
            const content = {
                identifier: 'parentid',
                contentData: {identifier: 'parentid'},
                children: [
                    {identifier: 'childid', basePath: 'basePath', mimeType: MimeType.COLLECTION, contentData: {identifier: 'id2'}}
                ]
            };
            qrcoderesultPage.searchIdentifier = 'childid';
            qrcoderesultPage.identifier = 'sampleid';
            mockContentService.getChildContents = jest.fn(() => of(content as any));
            mockAppGlobalService.getCurrentUser = jest.fn(() => 'currentuser');
            mockZone.run = jest.fn((fn) => fn());
            // spyOn(qrcoderesultPage, 'calculateAvailableUserCount').and.stub();
            // act
            qrcoderesultPage.getChildContents();
            // assert
            expect(mockContentService.getChildContents).toHaveBeenCalled();
            setTimeout(() => {
                expect(mockTelemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(
                    ImpressionType.VIEW,
                    '',
                    PageId.DIAL_LINKED_NO_CONTENT,
                    Environment.HOME
                );
                expect(mockCommonUtilService.showContentComingSoonAlert).toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    describe('importContent', () => {
        it('should import content', () => {
            // assert
            const response = {
                identifier: 'sampleId',
                status: 1
            };
            mockContentService.importContent = jest.fn(() => of(response as any));
            // action
            qrcoderesultPage.importContent(['id1'], true);
            // assert
            expect(mockContentService.importContent).toHaveBeenCalled();

        });
        it('should fail in import content', (done) => {
            // arrange
            const response = {
                identifier: 'sampleId',
                status: 1
            };
            mockContentService.importContent = jest.fn(() => throwError('err' as any));
            // action
            qrcoderesultPage.importContent(['id1'], true);
            // assert
            expect(mockContentService.importContent).toHaveBeenCalled();
            setTimeout(() => {
                expect(qrcoderesultPage.isDownloadStarted).toBe(false);
                expect(mockCommonUtilService.showToast).toHaveBeenCalledWith('UNABLE_TO_FETCH_CONTENT');
                done();
            }, 0);

        });
    });

    describe('navigateToDetailsPage', () => {
        it('should navigate to enrolled course details page', () => {
            // arrange
            const content = {
                contentData: {
                    contentType: ContentType.COURSE
                }
            };
            // act
            qrcoderesultPage.navigateToDetailsPage(content);
            // assert
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                [RouterLinks.ENROLLED_COURSE_DETAILS],
                expect.anything()
            );
        });
        it('should navigate to collection details ETB page', () => {
            // arrange
            const content = {
                mimeType: MimeType.COLLECTION
            };
            const paths = [
                {identifier: 'id1'},
                {identifier: 'id2'},
            ];
            mockTextbookTocService.setTextbookIds = jest.fn();
            // act
            qrcoderesultPage.navigateToDetailsPage(content, paths, 'sampleId');
            // assert
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                [RouterLinks.COLLECTION_DETAIL_ETB],
                expect.anything()
            );
            expect(mockTextbookTocService.setTextbookIds).toHaveBeenCalledWith(
                {rootUnitId: 'id2', contentId: 'sampleId'}
            );
        });
        it('should navigate to content details page', () => {
            // arrange
            const content = {
                identifier: 'id'
            };
            mockTextbookTocService.setTextbookIds = jest.fn();
            // act
            qrcoderesultPage.navigateToDetailsPage(content);
            // assert
            expect(mockRouter.navigate).toHaveBeenCalledWith(
                [RouterLinks.CONTENT_DETAILS],
                expect.anything()
            );
            expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalled();
        });
    });

    it('should get all the profiles', (done) => {
        // arrange
        qrcoderesultPage.identifier = 'sampleid';
        mockProfileService.getAllProfiles = jest.fn(() => of([{handle: 'handle1'}] as any));
        mockAppGlobalService.isUserLoggedIn =  jest.fn(() => true);
        // act
        qrcoderesultPage.calculateAvailableUserCount();
        // assert
        setTimeout(() => {
            expect(qrcoderesultPage.userCount).toEqual(2);
            done();
        }, 0);
        expect(mockProfileService.getAllProfiles).toHaveBeenCalled();
        // expect(qrcoderesultPage.userCount).toEqual(1);
    });

    it('should add elipsis in long text', () => {
        // arrange
        mockCommonUtilService.translateMessage = jest.fn(() => 'msg');
        // act
        // assert
        expect(qrcoderesultPage.addElipsesInLongText('MSG')).toEqual('msg');
    });

    it('should add elipsis in long text', () => {
        // arrange
        mockCommonUtilService.translateMessage = jest.fn(() => 'msglongerthan8charecters');
        // assert
        expect(qrcoderesultPage.addElipsesInLongText('MSG')).toEqual('msglongerthan8charecters'.slice(0, 8) + '....');
        // assert
    });

    describe('setContentDetails', () => {
        it('should set contentDetails', () => {
            // arrange
            mockContentService.getContentDetails = jest.fn(() => of({ identifier: 'id'} as any));
            // spyOn(qrcoderesultPage, 'calculateAvailableUserCount').and.stub();
            // act
            qrcoderesultPage.setContentDetails('id', true);
            // assert
            expect(mockContentService.getContentDetails).toHaveBeenCalled();
        });
    });

    describe('subscribeSdkEvent', () => {
        it('should set downloadProgress to 0', () => {
            // arrange
            const event = {
                type: DownloadEventType.PROGRESS,
                payload: {
                    progress: -1
                }
            };
            mockEventsBusService.events = jest.fn(() => of(event as any));
            // action
            qrcoderesultPage.subscribeSdkEvent();
            // assert
            expect(qrcoderesultPage.downloadProgress).toEqual(0);
        });
        it('should set downloadProgress', () => {
            // arrange
            const event = {
                type: DownloadEventType.PROGRESS,
                payload: {
                    progress: 80,
                    identifier: 'sampleId'
                }
            };
            qrcoderesultPage.content = {identifier: 'sampleId'} as any;
            mockEventsBusService.events = jest.fn(() => of(event as any));
            // action
            qrcoderesultPage.subscribeSdkEvent();
            // assert
            expect(qrcoderesultPage.downloadProgress).toEqual(80);
        });
        it('should call getchildcontents', () => {
            // arrange
            const event = {
                type: ContentEventType.IMPORT_COMPLETED,
                payload: {
                    progress: 100,
                    identifier: 'sampleId'
                }
            };
            mockEventsBusService.events = jest.fn(() => of(event as any));
            spyOn(qrcoderesultPage, 'getChildContents').and.stub();
            // action
            qrcoderesultPage.subscribeSdkEvent();
            // assert
            expect(qrcoderesultPage.isDownloadStarted).toEqual(false);
            expect(qrcoderesultPage.getChildContents).toHaveBeenCalled();
        });
        it('should call import contents', () => {
            // arrange
            const event = {
                type: ContentEventType.UPDATE,
                payload: {
                    progress: 80,
                    contentId: 'sampleId'
                }
            };
            qrcoderesultPage.parentContent = {identifier: 'id'};
            qrcoderesultPage.identifier = 'sampleId';
            mockEventsBusService.events = jest.fn(() => of(event as any));
            qrcoderesultPage.importContent = jest.fn();
            // action
            qrcoderesultPage.subscribeSdkEvent();
            // assert
            expect(qrcoderesultPage.importContent).toHaveBeenCalledWith(
                ['id'],
                false
            );
        });
    });

    describe('set grade and medium', () => {
        it('should reset grade', () => {
            // arrange
            qrcoderesultPage.profile = {} as any;
            // assert
            qrcoderesultPage.setGrade(true, ['grade1']);
            // assert
            expect(qrcoderesultPage.profile.grade.length).toEqual(1);
        });
        it('should set grade', () => {
            // arrange
            qrcoderesultPage.profile = {
                grade: ['grade']
            } as any;
            // assert
            qrcoderesultPage.setGrade(false, ['grade1']);
            // assert
            expect(qrcoderesultPage.profile.grade.length).toEqual(2);
        });
        it('should reset medium', () => {
            // arrange
            qrcoderesultPage.profile = {} as any;
            // assert
            qrcoderesultPage.setMedium(true, ['medium1']);
            // assert
            expect(qrcoderesultPage.profile.medium.length).toEqual(1);
        });
        it('should set medium', () => {
            // arrange
            qrcoderesultPage.profile = {
                medium: ['medium']
            } as any;
            // assert
            qrcoderesultPage.setMedium(false, ['medium1']);
            // assert
            expect(qrcoderesultPage.profile.medium.length).toEqual(2);
        });
        it('should find code of a category', () => {
            // arrange
            const categoryType = 'grade';
            const categoryList = [{name: 'sampleName', code: 'sampleCode'}];
            const data = {grade: 'sampleName'};
            // assert
            // assert
            expect(qrcoderesultPage.findCode(categoryList, data, categoryType)).toEqual('sampleCode');
        });
        it('should find code of a category', () => {
            // arrange
            const categoryType = 'grade';
            const categoryList = [{name: 'sampleName', code: 'sampleCode'}];
            const data = {grade: 'Name'};
            // assert
            // assert
            expect(qrcoderesultPage.findCode(categoryList, data, categoryType)).toBeUndefined();
        });
    });

    describe('goBack', () => {
        it('should get navigate to previous route', () => {
            // arrange
            mockCommonUtilService.translateMessage = jest.fn(() => 'msglongerthan8charecters');
            qrcoderesultPage.content = {identifier: 'sampleId'} as any;
            // act
            qrcoderesultPage.goBack();
            // assert
            expect(mockTelemetryGeneratorService.generateBackClickedTelemetry).toHaveBeenCalledWith(
                PageId.DIAL_CODE_SCAN_RESULT,
                Environment.HOME,
                true,
                'sampleId',
                undefined);
        });
        it('should get navigate to previous to previous route', () => {
            // arrange
            mockCommonUtilService.translateMessage = jest.fn(() => 'msglongerthan8charecters');
            qrcoderesultPage.content = {identifier: 'sampleId'} as any;
            qrcoderesultPage.isQrCodeLinkToContent = true;
            // act
            qrcoderesultPage.goBack();
            // assert
            expect(mockTelemetryGeneratorService.generateBackClickedTelemetry).toHaveBeenCalledWith(
                PageId.DIAL_CODE_SCAN_RESULT,
                Environment.HOME,
                true,
                'sampleId',
                undefined);
        });
    });
    describe('cancelDownload', () => {
        it('should cancel ongoing download', (done) => {
            // arrange
            mockTelemetryGeneratorService.generateCancelDownloadTelemetry = jest.fn();
            const content = {identifier: 'sampleId'} as any;
            qrcoderesultPage.content = content;
            qrcoderesultPage.identifier = 'sampleId';
            mockContentService.cancelDownload = jest.fn(() => of(undefined as any));
            // act
            qrcoderesultPage.cancelDownload();
            // assert
            setTimeout(() => {
                expect(mockTelemetryGeneratorService.generateCancelDownloadTelemetry).toHaveBeenCalledWith(content);
                expect(mockLocation.back).toHaveBeenCalled();
                done();
            }, 0);
        });
        it('should cancel ongoing download', (done) => {
            // arrange
            mockTelemetryGeneratorService.generateCancelDownloadTelemetry = jest.fn();
            const content = {identifier: 'sampleId'} as any;
            qrcoderesultPage.content = content;
            qrcoderesultPage.identifier = 'sampleId';
            mockContentService.cancelDownload = jest.fn(() => throwError(undefined as any));
            // act
            qrcoderesultPage.cancelDownload();
            // assert
            setTimeout(() => {
                expect(mockTelemetryGeneratorService.generateCancelDownloadTelemetry).toHaveBeenCalledWith(content);
                expect(mockLocation.back).toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    it('should get FirstChild Of Chapter', () => {
        // arrange
        const unit = {
            identifier: 'parentid',
            contentData: {identifier: 'parentid'},
            mimeType: MimeType.COLLECTION,
            children: [{identifier: 'childid', basePath: 'basePath'}]
        };
        mockCommonUtilService.translateMessage = jest.fn(() => 'msglongerthan8charecters');
        // act
        qrcoderesultPage.getFirstChildOfChapter(unit);
        // assert
        expect(qrcoderesultPage.chapterFirstChildId).toEqual('childid');
    });

    it('should open textbook toc page', () => {
        // arrange
        const values = new Map();
        // act
        qrcoderesultPage.openTextbookToc();
        // assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(
            [`/${RouterLinks.COLLECTION_DETAIL_ETB}/${RouterLinks.TEXTBOOK_TOC}`],
            expect.anything()
        );
        expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
            InteractType.TOUCH,
            InteractSubtype.DROPDOWN_CLICKED,
            Environment.HOME,
            PageId.DIAL_CODE_SCAN_RESULT,
            undefined,
            values
        );
    });



});
