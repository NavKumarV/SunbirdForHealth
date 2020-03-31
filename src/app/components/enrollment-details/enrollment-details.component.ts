import { Component, NgZone, Inject } from '@angular/core';
import { NavController, Events, PopoverController, NavParams } from '@ionic/angular';
import {
  SharedPreferences,
  EnrollCourseRequest,
  AuthService,
  TelemetryObject,
  InteractType,
  CourseBatchesRequest,
  CourseEnrollmentType,
  CourseBatchStatus
} from 'sunbird-sdk';
import { PreferenceKey, ProfileConstants, EventTopics, ContentType, MimeType, BatchConstants, RouterLinks } from '@app/app/app.constant';
import { CommonUtilService } from '@app/services/common-util.service';
import { TelemetryGeneratorService } from '@app/services/telemetry-generator.service';
import { InteractSubtype, Environment, PageId } from '@app/services/telemetry-constants';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { LocalCourseService } from '@app/services';
import { EnrollCourse } from '@app/app/enrolled-course-details-page/course.interface';

@Component({
    selector: 'app-enrollment-details',
    templateUrl: './enrollment-details.component.html',
    styleUrls: ['./enrollment-details.component.scss'],
})
export class EnrollmentDetailsComponent {
    ongoingBatches: any;
    upcommingBatches: any;
    retiredBatched: any;
    userId: any;
    isGuestUser: boolean;
    layoutInProgress: string;
    sectionName: any;
    index: any;
    layoutName: any;
    pageName: any;
    env: any;
    courseId: any;
    todayDate: string;

    constructor(
        @Inject('AUTH_SERVICE') private authService: AuthService,
        @Inject('SHARED_PREFERENCES') private preference: SharedPreferences,
        public navCtrl: NavController,
        public navParams: NavParams,
        private events: Events,
        private zone: NgZone,
        private popOverCtrl: PopoverController,
        private telemetryGeneratorService: TelemetryGeneratorService,
        private commonUtilService: CommonUtilService,
        private router: Router,
        private localCourseService: LocalCourseService
    ) {
        this.ongoingBatches = this.navParams.get('ongoingBatches');
        this.upcommingBatches = this.navParams.get('upcommingBatches');
        this.retiredBatched = this.navParams.get('retiredBatched');
        this.todayDate = (dayjs['default'] || dayjs)().format('YYYY-MM-DD');
        this.courseId = this.navParams.get('courseId');
        this.getUserId();

    }

    close(data?: any) {
        return this.popOverCtrl.dismiss(data);
    }

    resumeCourse(content: any) {
        this.saveContentContext(content);

        if (content.lastReadContentId && content.status === 1) {
            this.events.publish('course:resume', { content });
            this.close();
        } else {
            this.close().then(() => {
                this.router.navigate([`/${RouterLinks.ENROLLED_COURSE_DETAILS}`], { state: { content } });
            });
        }
    }

    saveContentContext(content: any) {
        const contentContextMap = new Map();
        // store content context in the below map
        contentContextMap['userId'] = content.userId;
        contentContextMap['courseId'] = content.courseId;
        contentContextMap['batchId'] = content.batchId;
        if (content.batch) {
            contentContextMap['batchStatus'] = content.batch.status;
        }

        // store the contentContextMap in shared preference and access it from SDK
        this.preference.putString(PreferenceKey.CONTENT_CONTEXT, JSON.stringify(contentContextMap));
    }

    enrollIntoBatch(content: any): void {

        const enrollCourseRequest = this.localCourseService.prepareEnrollCourseRequest(this.userId, content, this.courseId);
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
            InteractSubtype.ENROLL_CLICKED,
            Environment.HOME,
            PageId.CONTENT_DETAIL, undefined,
            this.localCourseService.prepareRequestValue(enrollCourseRequest));

        const loader = this.commonUtilService.getLoader();
        loader.present();
        const enrollCourse: EnrollCourse = {
            userId: this.userId,
            batch: content,
            pageId: PageId.COURSE_BATCHES,
            courseId: this.courseId
        };
        this.localCourseService.enrollIntoBatch(enrollCourse).toPromise()
            .then((data: any) => {
                this.zone.run(() => {
                    this.commonUtilService.showToast(this.commonUtilService.translateMessage('COURSE_ENROLLED'));
                    this.events.publish(EventTopics.ENROL_COURSE_SUCCESS, {
                        batchId: content.id,
                        courseId: content.courseId
                    });
                    loader.dismiss();
                    this.popOverCtrl.dismiss({ isEnrolled: true });
                    this.navigateToDetailPage(content);
                });
            }, (error) => {
                loader.dismiss();
            });
    }

    /**
     * Get logged-user id. User id is needed to enroll user into batch.
     */
    getUserId(): void {
        this.authService.getSession().toPromise().then((session) => {
            if (session === undefined || session == null) {
                console.log('session expired');
                this.zone.run(() => { this.isGuestUser = true; });
            } else {
                this.zone.run(() => {
                    this.isGuestUser = false;
                    this.userId = session[ProfileConstants.USER_TOKEN];
                });
            }
        });
    }

    navigateToDetailPage(content: any, layoutName?: string): void {
        const identifier = content.contentId || content.identifier;
        let type;
        if (layoutName === this.layoutInProgress) {
            type = ContentType.COURSE;
        } else {
            type = this.telemetryGeneratorService.isCollection(content.mimeType) ? content.contentType : ContentType.RESOURCE;
        }
        const telemetryObject: TelemetryObject = new TelemetryObject(identifier, type, '');

        const values = new Map();
        values['sectionName'] = this.sectionName;
        values['positionClicked'] = this.index;

        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
            InteractSubtype.CONTENT_CLICKED,
            this.env,
            this.pageName ? this.pageName : this.layoutName,
            telemetryObject,
            values
        );
        content.contentId = !content.contentId ? content.courseId : content.contentId;
        this.router.navigate([`/${RouterLinks.ENROLLED_COURSE_DETAILS}`], { state: { content } });
    }

}
