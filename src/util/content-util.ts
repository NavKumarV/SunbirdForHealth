import { Rollup, Content, ContentData, TelemetryObject } from 'sunbird-sdk';
export class ContentUtil {


  /**
   * Returns values from ContentData in a comma-separated string
   *  @param ContentData contentData
   *  @param string[] properties
   *  @returns string
   */

  public static mergeProperties(contentData: ContentData, properties: string[]): string {
    let displayStr: string;
    properties.forEach( ele => {
      if (contentData[ele]) {
        contentData[ele] = this.arrayEmptyStringCheck(contentData[ele]);
        if (displayStr) {
          displayStr = displayStr + ', ' + contentData[ele];
        } else {
          displayStr = contentData[ele];
        }
      }
    });
    return displayStr;
  }

  public static arrayEmptyStringCheck(value: Array<string | number>): Array<string> | string | object {
    let returnValue: Array<string | number>;
    if (value.constructor === Array) {
      returnValue = value.filter((el) => {
        return el !== null && el !== '';
      });
      return returnValue;
    } else {
      return value;
    }
  }

    /**
     * Returns rollup
     * @param HierarchyInfo[] hierarchyInfoList
     * @param string identifier
     * @returns Rollup
     */
  public static generateRollUp(hierarchyInfoList, identifier): Rollup {
    const rollUp = new Rollup();
    if (!hierarchyInfoList) {
      rollUp.l1 = identifier;
    } else {
      for (let i = 0; i < hierarchyInfoList.length; i++) {
        const element = hierarchyInfoList[i];
        rollUp['l' + (i + 1)] = element.identifier;
      }
    }
    return rollUp;
  }

    /**
     * Returns apt app icon
     * @param string appIcon
     * @param string basePath
     * @param boolean isNetworkAvailable
     * @returns string
     */
  public static getAppIcon(appIcon: string, basePath: string, isNetworkAvailable: boolean): string {
    if (appIcon) {
      if (appIcon.startsWith('http')) {
        if (!isNetworkAvailable) {
          appIcon = 'assets/imgs/ic_launcher.png';
        }
      } else if (basePath) {
        appIcon = basePath + '/' + appIcon;
      }
    }
    return appIcon;
  }

  public static resolvePDFPreview(content: Content): { url: string, availableLocally: boolean } | undefined {
    let pdf: { url: string, availableLocally: boolean } | undefined;

    if (!content.contentData.itemSetPreviewUrl) {
      return undefined;
    }

    try {
      pdf = { url: (new URL(content.contentData.itemSetPreviewUrl)).toString(), availableLocally: false };
    } catch (e) {
      pdf = { url: content.basePath + content.contentData.itemSetPreviewUrl, availableLocally: true };
    }

    return pdf;
  }

    /**
     * Returns TelemetryObject
     * @param any content
     * @returns TelemetryObject
     */
    public static getTelemetryObject(content): TelemetryObject {
      const identifier = content.identifier;
      const contentType = content.contentData ? content.contentData.contentType : content.contentType;
      const pkgVersion = content.contentData ? content.contentData.pkgVersion : content.pkgVersion;
      return new TelemetryObject(identifier, contentType, pkgVersion);
    }

}
