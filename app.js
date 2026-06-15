// ==========================================================================
// Syllabus Database (12 Topics)
// ==========================================================================
const syllabusData = {
    stl_intro: {
        module: "Module 1: Core Framework",
        title: "1. STL คืออะไร?",
        narrative: `
            <h4>ภาพรวมของ Semiconductor Test Library (STL)</h4>
            <p><strong>STL</strong> คือชุดคลาสและอ็อบเจกต์สำเร็จรูป (C# class library) ที่ถูกพัฒนาขึ้นโดยความร่วมมือระหว่าง NI และ Analog Devices เพื่อทำหน้าที่เป็นสถาปัตยกรรมระดับซอฟต์แวร์ตัวกลาง (Middle Layer) ที่เชื่อมประสานระหว่าง TestStand TSM (ตัวจัดการระบบเทส) กับไดรเวอร์ควบคุมฮาร์ดแวร์ระดับต่ำ (เช่น NI-DCPower และ NI-Digital Pattern)</p>
            
            <h4>ปัญหาเดิม (ถ้าเขียนโค้ดคุมฮาร์ดแวร์ตรงๆ):</h4>
            <ul>
                <li>โค้ดมีความซับซ้อนสูงเมื่อต้องจัดการระบบทดสอบหลายไซต์งานพร้อมกัน (Multisite) วิศวกรต้องจัดการเปิด/ปิดเซสชันและวนลูปประมวลผลข้อมูลวัดด้วยตนเอง</li>
                <li>โค้ดยุ่งยากเมื่อฮาร์ดแวร์เครื่องวัดในแร็คเปลี่ยนรุ่น ทำให้ต้องเข้าไปแก้ไขซอร์สโค้ดเกือบทุกจุด</li>
            </ul>

            <div class="tip-block">
                <div class="tip-block-title">💡 สิ่งที่ STL เข้ามาช่วยแก้ปัญหา</div>
                <p>STL ทำการซ่อนความซับซ้อนเหล่านั้นไว้หลังเมธอดที่เรียกใช้งานง่าย เช่น <code>ForceVoltage()</code> หรือ <code>MeasureAndPublishCurrent()</code> วิศวกรแค่ส่งอาร์กิวเมนต์สั้นๆ ที่ต้องการ ระบบจะรับไปแปลงสัญญาณและสั่งการบอร์ดฮาร์ดแวร์เดี่ยวๆ ทั้งหมดให้ขนานกันโดยอัตโนมัติ</p>
            </div>
        `,
        code: `// การนำ STL เข้ามาใช้งานในโปรเจกต์ Visual Studio
using NationalInstruments.SemiconductorTestLibrary.InstrumentAbstraction;
using NationalInstruments.SemiconductorTestLibrary.InstrumentAbstraction.DCPower;
using NationalInstruments.SemiconductorTestLibrary.InstrumentAbstraction.Digital;
using static NationalInstruments.SemiconductorTestLibrary.Common.Utilities;

namespace ADIProjectTemplate.TestModules
{
    // โค้ดของวิศวกรจะอิมพอร์ต Abstractions เหล่านี้เข้ามาสั่งงานแบบ High-level
}`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- Layers -->
                <rect x="50" y="10" width="300" height="40" class="dia-box active" />
                <text x="200" y="34" class="dia-text" style="fill: #1e293b;">TestStand TSM (ระดับบนสุด)</text>
                
                <path d="M200 50v20" class="dia-arrow" marker-end="url(#arrow)" />
                
                <rect x="50" y="70" width="300" height="40" class="dia-box" style="fill: #2b5c8f; stroke: #2b5c8f;" />
                <text x="200" y="94" class="dia-text" style="fill: #ffffff;">Semiconductor Test Library (STL)</text>
                
                <path d="M200 110v20" class="dia-arrow" marker-end="url(#arrow)" />
                
                <rect x="50" y="130" width="300" height="30" class="dia-box" />
                <text x="200" y="148" class="dia-text">NI Hardware Drivers (niDCPower, niDigital)</text>
                
                <path d="M200 160v20" class="dia-arrow" marker-end="url(#arrow)" />
                
                <rect x="50" y="180" width="300" height="30" class="dia-box" style="fill: #64748b; stroke: #64748b;" />
                <text x="200" y="198" class="dia-text" style="fill: #ffffff;">บอร์ดฮาร์ดแวร์เครื่องวัดจริง (Physical Hardware)</text>
            </svg>
        `
    },
    abstraction: {
        module: "Module 1: Core Framework",
        title: "2. Instrument Abstraction",
        narrative: `
            <h4>หลักการทำ Abstraction (การสั่งงานผ่านหน้าที่)</h4>
            <p><strong>Instrument Abstraction</strong> คือหัวใจสำคัญของการแยกส่วนการเขียนโปรแกรมทดสอบ (Test Logic) ออกจากชนิดการ์ดจริง (Hardware Model) โดยวิศวกรจะสั่งงานผ่าน <strong>"ชื่อพินและชนิดเครื่องมือวัด"</strong> แทนการระบุรุ่นหรือเลขช่องแชนเนลในโค้ด</p>
            
            <h4>ตัวอย่างการเปรียบเทียบเชิงวิศวกรรม:</h4>
            <ul>
                <li><strong>หากไม่มี Abstraction:</strong> คุณสั่งงานบอร์ดโมเดลเก่า <code>PXIe-6570 แชนเนล 4 จ่ายไฟ 3V</code> เมื่อย้ายโค้ดไปรันเครื่องใหม่ที่ใช้บอร์ดรุ่นความหนาแน่นสูง <code>PXIe-6571</code> โค้ดจะพังทันที</li>
                <li><strong>หากใช้ Abstraction:</strong> คุณระบุว่า <code>สั่งพิน Digital "CS" ให้จ่ายไฟ 3V</code> ซึ่งตัวเฟรมเวิร์กจะคอยเปิดทะเบียนแผนผังพิน (.pinmap) ตรวจว่า CS ในตอนนี้เสียบอยู่กับบอร์ดรุ่นไหน แชนเนลใด แล้วสั่งงานให้เองอย่างถูกต้อง</li>
            </ul>

            <div class="tip-block">
                <div class="tip-block-title">💡 ประโยชน์ในโปรเจกต์จริง</div>
                <p>ทำให้โค้ด C# ในไฟล์อย่าง <code>Continuity.cs</code> และ <code>Leakage.cs</code> สามารถนำไปรันบนระบบทดสอบตู้ใดก็ได้ในโรงงานผลิต โดยไม่ต้องแก้ซอร์สโค้ดและคอมไพล์ใหม่แม้แต่บรรทัดเดียวเมื่อมีการปรับย้ายการ์ดฮาร์ดแวร์</p>
            </div>
        `,
        code: `// การสั่งจ่ายไฟด้วยวิธีเดียวกัน ไม่ว่าพินจะผูกกับการ์ดรุ่นใดก็ตาม
// 1. ส่งคำสั่งผ่านพินกลุ่มดิจิตัล (ใช้บอร์ดดิจิตอลเป็น PPMU)
digitalPinSessions.ForceVoltage(1.8, currentLimit);

// 2. ส่งคำสั่งผ่านพินกลุ่มพลังงานหลัก (ใช้บอร์ด SMU)
dcPowerPinSessions.ForceVoltage(1.8, currentLimit);`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- C# Code Pin Reference -->
                <rect x="30" y="10" width="100" height="40" class="dia-box active" />
                <text x="80" y="34" class="dia-text" style="fill: #2b5c8f;">พิน CS</text>
                
                <path d="M130 30h40" class="dia-arrow" />
                
                <!-- Abstraction Layer -->
                <rect x="170" y="10" width="200" height="40" class="dia-box" style="fill: #f1f5f9; stroke: #2b5c8f;" />
                <text x="270" y="34" class="dia-text">Pin Map (.pinmap)</text>
                
                <!-- Branching Lines based on Pinmap configuration -->
                <path d="M270 50v40" class="dia-arrow" marker-end="url(#arrow)" />
                <path d="M270 70h-90v20" class="dia-arrow" marker-end="url(#arrow)" />
                <path d="M270 70h90v20" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Physical Cards -->
                <rect x="40" y="90" width="100" height="40" class="dia-box" />
                <text x="90" y="110" class="dia-text">บอร์ดสล็อต 2</text>
                <text x="90" y="122" class="dia-text-sub">แชนเนล 0 (GP3)</text>
                
                <rect x="150" y="90" width="100" height="40" class="dia-box" />
                <text x="200" y="110" class="dia-text">บอร์ดสล็อต 5</text>
                <text x="200" y="122" class="dia-text-sub">แชนเนล 12 (GP4)</text>
                
                <rect x="260" y="90" width="100" height="40" class="dia-box" style="fill: #e2e8f0;" />
                <text x="310" y="115" class="dia-text" style="fill: #64748b;">บอร์ดประเภทอื่น</text>
                
                <text x="200" y="180" class="dia-text" style="fill: #0f1e36;">เปลี่ยนเครื่องเทสหรือย้ายพิน = แก้ไขแค่ไฟล์ .pinmap</text>
                <text x="200" y="195" class="dia-text-sub">โดยไม่ต้องแตะต้องหรือคอมไพล์โค้ด C# ใหม่</text>
            </svg>
        `
    },
    session_manager: {
        module: "Module 1: Core Framework",
        title: "3. TSMSessionManager",
        narrative: `
            <h4>หัวหน้างานดึงข้อมูลและเชื่อมเซสชัน</h4>
            <p><strong>TSMSessionManager</strong> คือคลาสและตัวจัดการหลักในกล่องเครื่องมือของ STL ที่ทำหน้าที่ในการดึงข้อมูลช่องทางการสื่อสารกับบอร์ดฮาร์ดแวร์ขึ้นมาใช้งาน โดยดึงข้อมูลเชื่อมโยงจากตัวแปร <code>tsmContext</code> ของ TestStand</p>
            
            <h4>หน้าที่สำคัญในการเขียนโค้ด:</h4>
            <ul>
                <li><strong>สืบค้นและระบุที่อยู่ฮาร์ดแวร์:</strong> นำข้อมูลรายชื่อพินที่เราต้องการใช้ เช่น <code>"SupplyPins"</code> ไปเปิดตรวจสอบทะเบียนในไฟล์ <code>.pinmap</code> ย้อนหลังว่าผูกอยู่กับการ์ดสล็อตใด</li>
                <li><strong>เปิดเซสชัน (Open Session):</strong> ทำการสร้างท่อสื่อสารระหว่างโปรแกรมกับตัวการ์ดทางกายภาพ</li>
                <li><strong>ส่งคืนผลลัพธ์:</strong> ส่งคืนเซสชันเหล่านั้นกลับมาให้วิศวกรนำไปใช้งานต่อในรูปของ <strong>Session Bundle</strong></li>
            </ul>

            <div class="tip-block">
                <div class="tip-block-title">💡 เหตุผลที่ต้องเรียกใช้เป็นตัวแรกในฟังก์ชัน</div>
                <p>เพราะตัวแปร <code>tsmContext</code> เป็นเพียงตัวแปรเก็บข้อมูลสภาพแวดล้อมรวมเฉยๆ การจะสั่งจ่ายไฟเลี้ยงได้เราต้องมีวัตถุที่จะคุยกับการ์ดได้จริง ซึ่ง <code>TSMSessionManager</code> คือคนจองและดึงวัตถุนั้นขึ้นมาให้เราใช้งานครับ</p>
            </div>
        `,
        code: `// การประกาศเรียกใช้งานเซสชันเมเนเจอร์ในขั้นตอนเริ่มต้นรันเทสย่อย
public static void TS_Leakage(ISemiconductorModuleContext tsmContext, string[] pins)
{
    // สร้าง sessionManager โดยนำส่ง Context ของ TSM เข้าไป
    var sessionManager = new TSMSessionManager(tsmContext);
    
    // หลังจากนี้เราจะใช้ตัวแปร sessionManager ในการดึงเซสชันบอร์ดต่างๆ
}`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- TSM Context -->
                <rect x="30" y="40" width="100" height="50" class="dia-box" style="fill: #e2e8f0;" />
                <text x="80" y="65" class="dia-text">tsmContext</text>
                <text x="80" y="78" class="dia-text-sub">(จาก TestStand)</text>
                
                <path d="M130 65h40" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- TSMSessionManager -->
                <rect x="170" y="30" width="120" height="70" class="dia-box active" />
                <text x="230" y="62" class="dia-text" style="fill: #2b5c8f;">TSMSessionManager</text>
                <text x="230" y="78" class="dia-text-sub">(ตัวจัดการดึงเซสชัน)</text>
                
                <path d="M290 65h40" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Output Bundles -->
                <rect x="330" y="15" width="55" height="30" class="dia-box" />
                <text x="357" y="34" class="dia-text" style="font-size: 8px;">SMU Bundle</text>
                
                <rect x="330" y="55" width="55" height="30" class="dia-box" />
                <text x="357" y="74" class="dia-text" style="font-size: 8px;">Digital Bundle</text>
                
                <!-- Pinmap lookup indicator -->
                <path d="M230 100v30" class="dia-arrow" marker-end="url(#arrow)" />
                <rect x="170" y="130" width="120" height="30" class="dia-box" style="fill: #fffbeb; stroke: #f59e0b;" />
                <text x="230" y="148" class="dia-text" style="fill: #d97706; font-size: 10px;">เปิดสืบค้นใน ADI.pinmap</text>
            </svg>
        `
    },
    session_bundle: {
        module: "Module 1: Core Framework",
        title: "4. Session Bundle คืออะไร?",
        narrative: `
            <h4>ความหมายและพฤติกรรมของ Session Bundle</h4>
            <p><strong>Session Bundle</strong> คือวัตถุอ็อบเจกต์พิเศษที่ทำหน้าที่ <strong>"มัดรวมและห่อหุ้มเซสชันควบคุมฮาร์ดแวร์"</strong> ทั้งหมดที่ผูกอยู่กับพินทดสอบที่เราสั่งงาน</p>
            
            <h4>เปรียบเหมือน "วอสื่อสารกลุ่ม" (Group Walkie-Talkie):</h4>
            <p>หากเราต้องการสั่งจ่ายไฟ 3.3V ให้กับพิน <code>Vcc</code> ของชิป 4 ตัวพร้อมกัน (Multisite 4 Sites) บอร์ด SMU จริงจะต้องจ่ายไฟออกทั้งหมด 4 ช่องแชนเนล:</p>
            <ul>
                <li><strong>ถ้าไม่มี Bundle:</strong> วิศวกรต้องเขียนโค้ดโทรสั่งคนงาน (แชนเนลบอร์ด) ทีละคน รวม 4 รอบเพื่อให้ทำงานพร้อมกัน</li>
                <li><strong>ถ้าใช้ Bundle:</strong> คุณถือวิทยุสื่อสารแบบกลุ่ม ยกวอขึ้นมากดปุ่มพูดสั่งงาน <strong>"ครั้งเดียว"</strong> ว่า <code>smuPins.ForceVoltage(3.3, currentLimit)</code> คนงานทุกคนจะได้ยินคำสั่งและสับสวิตช์จ่ายไฟให้พร้อมกันทันทีในทางกายภาพ</li>
            </ul>

            <div class="tip-block">
                <div class="tip-block-title">💡 ประเภทของ Bundle ในโปรเจกต์</div>
                <ul>
                    <li><code>DCPowerSessionsBundle</code>: ใช้ควบคุมสั่งการกลุ่มบอร์ดจ่ายกระแสละเอียด (SMU)</li>
                    <li><code>DigitalSessionsBundle</code>: ใช้ควบคุมสั่งการกลุ่มบอร์ดดิจิทัลและ PPMU</li>
                </ul>
            </div>
        `,
        code: `// ดึงเซสชันขึ้นมาแบบ Bundle มัดรวมพินทั้งหมดในกลุ่ม "SupplyPins"
DCPowerSessionsBundle smuPins = sessionManager.DCPower("SupplyPins");

// สั่งงานจุดเดียวคำสั่งเดียว ตัวกล่อง Bundle จะทำหน้าที่ลูปกระจายสัญญาณ
// สั่งการบอร์ด SMU ทุกแชนเนลที่ผูกอยู่ให้จ่ายแรงดัน 3.3V พร้อมกันขนานกัน
smuPins.ForceVoltage(3.3, currentLimit);`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- User command -->
                <rect x="20" y="30" width="130" height="40" class="dia-box active" />
                <text x="85" y="54" class="dia-text" style="fill: #2b5c8f; font-size: 10px;">smuPins.ForceVoltage(3.3)</text>
                <text x="85" y="65" class="dia-text-sub" style="font-size: 8px;">(วิศวกรสั่งงาน 1 คำสั่ง)</text>
                
                <path d="M150 50h40" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Session Bundle -->
                <rect x="190" y="20" width="90" height="180" class="dia-box" style="fill: #f1f5f9; stroke: #2b5c8f;" />
                <text x="235" y="40" class="dia-text">Session Bundle</text>
                <text x="235" y="52" class="dia-text-sub">(กล่องมัดรวมของ STL)</text>
                
                <!-- Internal Routing to Channels -->
                <path d="M280 50h40" class="dia-arrow" marker-end="url(#arrow)" />
                <path d="M280 50h20v40h20" class="dia-arrow" marker-end="url(#arrow)" />
                <path d="M280 50h20v80h20" class="dia-arrow" marker-end="url(#arrow)" />
                <path d="M280 50h20v120h20" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Channels output -->
                <rect x="320" y="35" width="65" height="25" class="dia-box" />
                <text x="352.5" y="50" class="dia-text" style="font-size: 8px; text-anchor: middle;">SMU Ch 0 (3.3V)</text>
                
                <rect x="320" y="75" width="65" height="25" class="dia-box" />
                <text x="352.5" y="90" class="dia-text" style="font-size: 8px; text-anchor: middle;">SMU Ch 1 (3.3V)</text>
                
                <rect x="320" y="115" width="65" height="25" class="dia-box" />
                <text x="352.5" y="130" class="dia-text" style="font-size: 8px; text-anchor: middle;">SMU Ch 2 (3.3V)</text>
                
                <rect x="320" y="155" width="65" height="25" class="dia-box" />
                <text x="352.5" y="170" class="dia-text" style="font-size: 8px; text-anchor: middle;">SMU Ch 3 (3.3V)</text>
            </svg>
        `
    },
    sitedata: {
        module: "Module 1: Core Framework",
        title: "5. SiteData / PinSiteData",
        narrative: `
            <h4>การบริหารจัดเก็บข้อมูลแยกรายไซต์งานทดสอบ</h4>
            <p>ในการทดสอบแบบคู่ขนาน (Multisite Testing) ผลลัพธ์ตัวเลขที่วัดได้จากชิปแต่ละตัวจะต้องถูกแยกประเภทจากกันชัดเจน (เช่น ชิปตัวที่ 0 วัดค่ารั่วได้ 5µA, ตัวที่ 1 วัดได้ 1.2mA ซึ่งสอบตก)</p>
            
            <h4>กล่องเก็บตารางข้อมูลแยกรายตัว:</h4>
            <ul>
                <li><strong>SiteData&lt;T&gt;:</strong> เปรียบเหมือนใบสรุปคะแนนรวมวิชาของนักเรียนในห้อง (1 คนมี 1 คะแนน) สำหรับเก็บค่าสรุปเดี่ยวของชิปแต่ละไซต์งานทดสอบ เช่น ผล Pass/Fail หรืออุณหภูมิรวมชิป</li>
                <li><strong>PinSiteData&lt;T&gt;:</strong> เปรียบเหมือนตารางแจกแจงคะแนนย่อยแยกตามรายข้อสอบของนักเรียนแต่ละคน สำหรับเก็บค่าวัดละเอียดแยกตามขาพินชิปแต่ละขาของแต่ละไซต์ทดสอบ เช่น บันทึกค่ารั่วของขา SCLK, CS, MISO แยกทีละพินและทีละตัวชิป</li>
            </ul>

            <h4>ความแตกต่างระหว่าง DUT Pins และ System Pins:</h4>
            <ul>
                <li><strong>DUT Pins (Device Under Test Pins):</strong> คือพินทดสอบที่เชื่อมตรงกับชิปของชิ้นงานทดสอบโดยเฉพาะ เช่น ขาจ่ายไฟ ขาสัญญาณ ซึ่งในระบบ Multisite ชิปแต่ละตัวจะมีช่องทางวัดแยกออกจากกันอย่างเป็นเอกเทศ ดังนั้นเมื่อทำการวัดค่า ผลลัพธ์ที่ได้จึงต้องถูกบรรจุในรูปแบบ <code>SiteData</code> เพื่อแบ่งแยกผลของแต่ละไซต์</li>
                <li><strong>System Pins (พินของระบบ):</strong> คือพินพิเศษที่ใช้ควบคุมส่วนกลางร่วมกันเพียงจุดเดียวสำหรับทุกไซต์ทดสอบ เช่น พินต่อคุมเครื่องมือวัดกลาง หรือสัญญาณไฟสถานะรวมของโหลดบอร์ด การควบคุมเซสชันของ System Pins จึงไม่ต้องประมวลผลแยกไซต์และไม่มีความซับซ้อนของโครงสร้าง <code>SiteData</code> เข้ามาเกี่ยวข้อง</li>
            </ul>

            <div class="tip-block">
                <div class="tip-block-title">💡 เหตุผลที่ต้องใช้ SiteData ในโค้ด C#</div>
                <p>เพราะเมธอดของ TestStand และระบบจัดเก็บรายงานผล Datalog ถูกกำหนดโครงสร้างข้อมูลไว้ว่า เวลาส่งรายงานค่าวัดกลับขึ้นไปหา TSM คุณต้องส่งในรูปแบบของอ็อบเจกต์ <code>SiteData</code> เพื่อให้ระบบนำค่าไปป้อนรีพอร์ตสรุปได้ตรงไซต์ชิปที่วัดจริงครับ</p>
            </div>
        `,
        code: `// การเก็บประมวลผลและการแยกดึงข้อมูลจากกล่อง SiteData คืนมาเช็คเงื่อนไข
// 1. รับข้อมูลเข้ามาในรูปของตารางแยกรายไซต์ (SiteData)
SiteData<double> testVoltageResults = smuPins.MeasureVoltage();

// 2. วนลูปตรวจสอบแยกชิปแต่ละไซต์งานโดยเฉพาะ
foreach (int site in tsmContext.ActiveSites)
{
    // ดึงค่าแรงดันเฉพาะของชิปตัวที่กำลังรัน (site)
    double siteVoltage = testVoltageResults.GetValue(site);
    
    if (siteVoltage < 3.0) {
        // ดำเนินการคัดตกชิปตัวนั้นๆ
    }
}`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <!-- SiteData structure box -->
                <rect x="50" y="20" width="300" height="150" class="dia-box" style="fill: #f8fafc; stroke: #2b5c8f;" />
                <text x="200" y="40" class="dia-text">โครงสร้างอ็อบเจกต์ SiteData&lt;double&gt;</text>
                <line x1="50" y1="50" x2="350" y2="50" style="stroke: #e2e8f0; stroke-width: 1.5;" />
                
                <!-- Table headers -->
                <text x="120" y="75" class="dia-text" style="fill: #475569;">Site Number</text>
                <text x="280" y="75" class="dia-text" style="fill: #475569;">Value (ค่าวัดที่ได้)</text>
                <line x1="50" y1="85" x2="350" y2="85" style="stroke: #e2e8f0; stroke-width: 1.5;" />
                
                <!-- Table Rows -->
                <text x="120" y="110" class="dia-text">Site 0</text>
                <text x="280" y="110" class="dia-text" style="fill: #10b981;">1.25 mA (Pass)</text>
                <line x1="50" y1="120" x2="350" y2="120" style="stroke: #f1f5f9; stroke-width: 1;" />
                
                <text x="120" y="140" class="dia-text">Site 1</text>
                <text x="280" y="140" class="dia-text" style="fill: #ef4444;">18.42 mA (Fail)</text>
                
                <!-- Indicator of TSM publish -->
                <text x="200" y="200" class="dia-text-sub" style="font-weight: 600;">ส่งตารางชุดนี้ไปที่ TestStand เพื่อคัด Binning ชิปดี/เสีย</text>
            </svg>
        `
    },
    dcpower_flow: {
        module: "Module 2: Hardware Flows",
        title: "6. DCPower Flow (SMU)",
        narrative: `
            <h4>ขั้นตอนควบคุมและการจ่ายพลังงานไฟฟ้าผ่าน SMU</h4>
            <p>ในการสั่งงานการ์ด **SMU (Source Measure Unit)** หรือบอร์ดจ่ายกระแสตรงละเอียดของ NI จะมีลำดับขึ้นตอนระดับฮาร์ดแวร์เพื่อความถูกต้องและปลอดภัยของอุปกรณ์เสมอ ดังนี้:</p>
            
            <h4>ขั้นตอนการจ่ายไฟแบบมาตรฐาน (Force Voltage Sequence):</h4>
            <ol>
                <li><strong>Abort:</strong> ยกเลิกคำสั่งหรือคิวค้างเดิมของแชนเนลบอร์ด (<code>Control.Abort()</code>) เพื่อเคลียร์สถานะเริ่มต้น</li>
                <li><strong>Connect:</strong> สับสวิตช์ปิดรีเลย์เพื่อต่อแชนเนลเข้ากับพินทดสอบ (<code>Source.Output.Connected = true</code>)</li>
                <li><strong>Configure:</strong> กำหนดโหมดเป็นแบบค่าเดี่ยวคงที่ (<code>SinglePoint</code>) และระบุช่วงย่านการจ่ายและขีดจำเก็บกระแสไฟฟ้าเพื่อความปลอดภัย</li>
                <li><strong>Source Delay:</strong> ตั้งค่าหน่วงเวลาเสถียรของสัญญาณ (<code>SourceDelay</code>) เพื่อรอให้ระดับแรงดันไฟฟ้านิ่งสนิทและข้ามช่วงสัญญาณสั่นกระเพื่อมชั่วขณะ (Transient) ก่อนเริ่มการตรวจวัด</li>
                <li><strong>Initiate:</strong> สั่งปล่อยกระแส/แรงดันไฟฟ้าออกมาทำงานจริงชิ้นงานชิป (<code>Control.Initiate()</code>)</li>
            </ol>

            <div class="tip-block">
                <div class="tip-block-title">⚠️ ข้อระวังในมุมวิศวกร</div>
                <p>การข้ามขั้นตอน Abort หรือการไม่ตั้งค่าหน่วงเวลาการหน่วงประจุ (Source Delay) จะส่งผลโดยตรงต่อการอ่านค่ากระแสไฟฟ้าผิดพลาดจากการวัดสัญญาณกวนชั่วขณะ หรืออาจสร้างความเสียหาย (Electrical Overstress) แก่พินชิปได้</p>
            </div>
        `,
        code: `// โค้ดสั่งจ่ายไฟในระดับไดรเวอร์ดิบของ SMU (ถอดความจาก test.cs)
var dcOutput = sessions[0].Outputs[dcPowerChannelStrings[0]];

dcOutput.Control.Abort();                                                    // 1. เคลียร์งานค้าง
dcOutput.Source.Output.Connected = true;                                     // 2. ปิดรีเลย์สับสวิตช์ต่อสาย
dcOutput.Source.Voltage.VoltageLevel = voltageForce;                         // 3. ตั้งระดับแรงดันเป้าหมาย
dcOutput.Source.Mode = DCPowerSourceMode.SinglePoint;                        // 4. โหมดจ่ายไฟจุดเดียวคงที่
dcOutput.Source.SourceDelay = new PrecisionTimeSpan(settlingTime);            // 5. ตั้งเวลาหน่วงให้กระแสไฟนิ่ง
dcOutput.Source.Output.Enabled = true;                                       // 6. เปิดระบบเอาต์พุตแชนเนล
dcOutput.Control.Initiate();                                                 // 7. เริ่มทำงานจริงปล่อยพลังงาน`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- Flow columns -->
                <g transform="translate(10, 10)">
                    <rect x="0" y="10" width="90" height="30" class="dia-box" />
                    <text x="45" y="28" class="dia-text" style="font-size: 10px;">1. Abort</text>
                    <text x="45" y="38" class="dia-text-sub" style="font-size: 8px;">เคลียร์ระบบ</text>
                    
                    <path d="M90 25h20" class="dia-arrow" marker-end="url(#arrow)" />
                    
                    <rect x="110" y="10" width="90" height="30" class="dia-box" />
                    <text x="155" y="28" class="dia-text" style="font-size: 10px;">2. Connect</text>
                    <text x="155" y="38" class="dia-text-sub" style="font-size: 8px;">สับสวิตช์รีเลย์</text>
                    
                    <path d="M200 25h20" class="dia-arrow" marker-end="url(#arrow)" />
                    
                    <rect x="220" y="10" width="90" height="30" class="dia-box" />
                    <text x="265" y="28" class="dia-text" style="font-size: 10px;">3. Configure</text>
                    <text x="265" y="38" class="dia-text-sub" style="font-size: 8px;">ตั้งแรงดัน/Limit</text>
                </g>
                
                <path d="M285 55v25" class="dia-arrow" marker-end="url(#arrow)" />
                
                <g transform="translate(10, 80)">
                    <rect x="220" y="10" width="90" height="30" class="dia-box" />
                    <text x="265" y="28" class="dia-text" style="font-size: 10px;">4. Source Delay</text>
                    <text x="265" y="38" class="dia-text-sub" style="font-size: 8px;">หน่วงเวลารอไฟนิ่ง</text>
                    
                    <path d="M220 25h-20" class="dia-arrow" marker-end="url(#arrow)" />
                    
                    <rect x="110" y="10" width="90" height="30" class="dia-box" />
                    <text x="155" y="28" class="dia-text" style="font-size: 10px;">5. Enable Out</text>
                    <text x="155" y="38" class="dia-text-sub" style="font-size: 8px;">เปิดสิทธิ์แชนเนล</text>
                    
                    <path d="M110 25h-20" class="dia-arrow" marker-end="url(#arrow)" />
                    
                    <rect x="0" y="10" width="90" height="30" class="dia-box active" />
                    <text x="45" y="28" class="dia-text" style="font-size: 10px; fill: #2b5c8f;">6. Initiate</text>
                    <text x="45" y="38" class="dia-text-sub" style="font-size: 8px;">จ่ายพลังงานจริง</text>
                </g>
                
                <rect x="80" y="150" width="240" height="40" class="dia-box" style="fill: #fdf2f8; stroke: #db2777;" />
                <text x="200" y="168" class="dia-text" style="fill: #9d174d; font-size: 10px;">สำคัญมาก: Source Delay (หน่วงเวลาเสถียร)</text>
                <text x="200" y="182" class="dia-text-sub" style="fill: #c91866;">ช่วยข้ามผลกวนของคลื่นกระเพื่อมไฟฟ้าช่วงแรก (Transient)</text>
            </svg>
        `
    },
    digital_flow: {
        module: "Module 2: Hardware Flows",
        title: "7. Digital / PPMU Flow",
        narrative: `
            <h4>หลักการทำงานของบอร์ดดิจิทัลและหน่วยวัด PPMU</h4>
            <p>บอร์ดการ์ดดิจิทัลของ NI (เช่น <code>PXIe-6571</code>) นอกเหนือจากการรับส่งข้อมูลบิตความเร็วสูงแล้ว ด้านหลังของขั้วทดสอบทุกช่องแชนเนลจะมีโมดูลวัดขนาดจิ๋วที่ชื่อว่า **PPMU (Parametric Pin Measurement Unit)** ประจำอยู่ด้วย</p>
            
            <h4>โฟลว์คำสั่งแบบใช้ PPMU จ่ายกระแส/แรงดันไฟฟ้าแยกตามพิน:</h4>
            <ul>
                <li><strong>การตั้งค่า:</strong> สร้างออบเจกต์เก็บค่ากำหนดพินเฉพาะรายบุคคล เช่น <code>PPMUSettings</code> ระบุเป้าหมายแรงดัน ขีดจำกัดกระแสสูงสุด และช่วงหน้าต่างเวลารับข้อมูล (Aperture Time)</li>
                <li><strong>Force Signal:</strong> โค้ด C# สั่งส่งข้อมูลพจนานุกรมการตั้งค่าเข้าไปที่ <code>ForceVoltage(ppmuForceSettings)</code> เพื่อแยกจ่ายไฟตามความต้องการของพินดิจิทัลแต่ละพิน</li>
                <li><strong>Measure:</strong> สั่งตรวจจับวัดค่ากระแสไฟฟ้าไหลรั่ว หรือผลการตกกระทบระดับแรงดัน แล้วพับลิชผลกลับเข้า TestStand</li>
            </ul>

            <div class="tip-block">
                <div class="tip-block-title">💡 การสลับโหมดบอร์ดดิจิทัล</div>
                <p>ในการเขียนเทสบอร์ดดิจิทัลจะสลับสถานะได้ 2 รูปแบบหลัก: <strong>โหมด PPMU</strong> (ใช้วัดค่าพารามิเตอร์ระดับกระแสไฟเล็กๆ เช่น รั่วไหลหรือ Continuity) และ <strong>โหมด Pattern Burst</strong> (ใช้ส่งแพทเทิร์นรหัสข้อมูลสั่งงานการทำงานชิปแบบความเร็วสูง)</p>
            </div>
        `,
        code: `// โค้ดสั่งงานบอร์ดดิจิทัลแบบใช้หน่วยวัดย่อย PPMU (จาก Continuity.cs)
DigitalSessionsBundle ppmuPins = sessionManager.Digital(digitalTestPins.ToArray());
var ppmuForceSettings = new Dictionary<string, PPMUSettings>();

// วนลูปตั้งค่าให้พินดิจิทัลแต่ละพินทำงานด้วยการตั้งค่าเฉพาะของตนเอง
for (int i = 0; i < digitalTestPins.Count; i++) {
    ppmuForceSettings[digitalTestPins[i]] = new PPMUSettings() { 
        VoltageLevel = 0, // ตั้งแรงดัน 0V เป็นกราวด์ชั่วขณะ
        VoltageLimitHigh = ppmuPinVoltageLimitHigh,
        ApertureTime = apertureTime
    };
}
// สั่งรันจ่ายกระแสพร้อมกัน
ppmuPins.ForceVoltage(ppmuForceSettings);`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- Physical Digital Card -->
                <rect x="30" y="20" width="130" height="150" class="dia-box" style="fill: #f8fafc; stroke: #2b5c8f;" />
                <text x="95" y="40" class="dia-text">บอร์ดการ์ดดิจิทัล (6571)</text>
                <line x1="30" y1="50" x2="160" y2="50" style="stroke: #e2e8f0; stroke-width: 1.5;" />
                
                <!-- Inner PPMU Modules -->
                <rect x="45" y="65" width="100" height="25" class="dia-box active" />
                <text x="95" y="81" class="dia-text" style="fill: #2b5c8f; font-size: 10px;">PPMU แชนเนล 0</text>
                
                <rect x="45" y="100" width="100" height="25" class="dia-box active" />
                <text x="95" y="116" class="dia-text" style="fill: #2b5c8f; font-size: 10px;">PPMU แชนเนล 1</text>
                
                <rect x="45" y="135" width="100" height="25" class="dia-box active" />
                <text x="95" y="151" class="dia-text" style="fill: #2b5c8f; font-size: 10px;">PPMU แชนเนล 2</text>
                
                <!-- Outputs to Chip -->
                <path d="M145 77h100" class="dia-arrow" marker-end="url(#arrow)" />
                <path d="M145 112h100" class="dia-arrow" marker-end="url(#arrow)" />
                <path d="M145 147h100" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Target DUT Chip Pins -->
                <rect x="245" y="60" width="120" height="110" class="dia-box" />
                <text x="305" y="80" class="dia-text">ขาพินชิป (DUT)</text>
                <text x="305" y="105" class="dia-text-sub">ขา SCLK</text>
                <text x="305" y="125" class="dia-text-sub">ขา CS</text>
                <text x="305" y="145" class="dia-text-sub">ขา MOSI</text>
            </svg>
        `
    },
    dmm_flow: {
        module: "Module 2: Hardware Flows",
        title: "8. DMM Flow",
        narrative: `
            <h4>การวัดความละเอียดและความแม่นยำพิเศษผ่าน DMM</h4>
            <p>การใช้การ์ด **DMM (Digital Multimeter)** หรือมัลติมิเตอร์วัดละเอียดของ NI (เช่น <code>PXIe-4081</code>) มักนำมาประยุกต์ใช้ในกรณีทดสอบที่ต้องการระดับความเที่ยงตรงสูงเป็นพิเศษ ซึ่งบอร์ด SMU หรือ PPMU ทั่วไปให้ความแม่นยำไม่เพียงพอ</p>
            
            <h4>โฟลว์ลำดับขั้นตอนของคำสั่งควบคุมการ์ด DMM:</h4>
            <ol>
                <li><strong>Configure Measurement:</strong> ตั้งค่าประเภทการตรวจวัด เช่น วัดกระแสตรง แรงดันตรง ความต้านทาน หรือวัดไดโอด พร้อมระบุระดับความละเอียด (เช่น 7.5 digit)</li>
                <li><strong>Relay Routing:</strong> ควบคุมบอร์ด Relay Driver สั่งสลับสายเดินสัญญาณเพื่อเชื่อมต่อขั้ว DMM เข้าหาพิน DUT ที่ระบุอย่างถูกต้อง</li>
                <li><strong>Initiate & Read:</strong> ส่งคำสั่งรันให้ระบบเริ่มอ่านค่าวัดและดีเลย์หน่วงความเสถียรของสัญญาณ</li>
                <li><strong>Publish:</strong> คืนหน่วยความจำค่าวัดที่ได้และทำการส่งข้อมูลขึ้นสู่ TestStand</li>
            </ol>

            <div class="tip-block">
                <div class="tip-block-title">💡 ความต่างของ DMM ในตู้ ATE</div>
                <p>แม้ DMM จะมีความแม่นยำสูงมาก แต่มีข้อจำกัดทางกายภาพคือ <strong>มีจำนวนแชนเนลในบอร์ดน้อยมาก (มักใช้แชร์ร่วมกันผ่านสวิตช์รีเลย์)</strong> ทำให้วัดพร้อมกันขนานหลายพินไม่ได้ จึงต้องรันการวัดแบบไล่สายสัญญาณทีละพิน (Serial) ซึ่งขัดแย้งกับหลักการทำ Multisite ความเร็วสูง</p>
            </div>
        `,
        code: `// ตัวอย่างโค้ดจำลองการเรียกใช้งานและตั้งค่าการวัดแรงดันกระแสตรงของบอร์ด DMM
DmmSessionsBundle dmmPins = sessionManager.Dmm("SystemDmmPin");

// 1. ตั้งค่าการวัดของ DMM เป็นโหมดวัดแรงดันไฟฟ้ากระแสตรง (DC Voltage) ย่านวัด Auto
dmmPins.ConfigureMeasurement(DmmMeasurementMode.DcVoltage, range: -1.0, resolution: 0.0001);

// 2. สั่งอ่านค่าวัดละเอียด
SiteData<double> dmmMeasurement = dmmPins.Read();

// 3. พับลิชค่าแรงดันขึ้น TestStand
tsmContext.PublishResults(new string[] { "SystemDmmPin" }, "DmmVoltage", dmmMeasurement);`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- Precision DMM block -->
                <rect x="30" y="30" width="100" height="50" class="dia-box active" />
                <text x="80" y="55" class="dia-text" style="fill: #2b5c8f;">Precision DMM</text>
                <text x="80" y="68" class="dia-text-sub">(PXIe-4081)</text>
                
                <path d="M130 55h50" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Relay Switch Matrix block -->
                <rect x="180" y="25" width="80" height="160" class="dia-box" style="fill: #fffbeb; stroke: #f59e0b;" />
                <text x="220" y="50" class="dia-text" style="fill: #d97706;">Relay Switch</text>
                <text x="220" y="62" class="dia-text-sub">(Matrix Routing)</text>
                
                <!-- Relay switches lines -->
                <line x1="190" y1="90" x2="250" y2="120" style="stroke: #f59e0b; stroke-width: 2;" />
                <line x1="190" y1="130" x2="250" y2="130" style="stroke: #f59e0b; stroke-width: 1.5; stroke-dasharray: 2;" />
                
                <path d="M260 125h50" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Target Pins -->
                <rect x="310" y="100" width="70" height="50" class="dia-box" />
                <text x="345" y="125" class="dia-text">DUT Pins</text>
                <text x="345" y="138" class="dia-text-sub">(พินเป้าหมาย)</text>
            </svg>
        `
    },
    daq_flow: {
        module: "Module 2: Hardware Flows",
        title: "9. DAQ Flow",
        narrative: `
            <h4>การบันทึกคลื่นความถี่และประมวลผลข้อมูลผ่านการ์ด DAQ</h4>
            <p>การใช้งานการ์ด **DAQ (Data Acquisition)** เช่น รุ่น <code>PXIe-6368</code> หรือ <code>PXIe-4467</code> มักนำมาประยุกต์ใช้ในการตรวจวัดสัญญาณกระแสสลับ (AC) ความถี่ต่ำถึงปานกลาง การบันทึกรูปคลื่นสัญญาณไฟฟ้าเชิงเวลา (Waveform Capture) หรือใช้ปล่อยคลื่นเสียงเพื่อทดสอบชิปแอมพลิฟายเออร์</p>
            
            <h4>โฟลว์ขั้นตอนของบอร์ดควบคุม DAQ (ใช้วิธี Task-Based):</h4>
            <ol>
                <li><strong>Create Task:</strong> สร้างคำสั่งระบุประเภทแชนเนลการวัดทางอนาล็อก เช่น วัดระดับแรงดันอนาล็อกขาเข้า (Analog Input - AI Task)</li>
                <li><strong>Configure Timing & Sample Rate:</strong> ระบุอัตราความเร็วสุ่มข้อมูลบันทึก (เช่น 2 MS/s หรือ 2 ล้านจุดต่อวินาที) และจำนวนจุดที่ต้องการเก็บบันทึก</li>
                <li><strong>Start Task:</strong> สั่งสตาร์ทงานบอร์ดเพื่อเตรียมเปิดวงจรรับข้อมูลสัญญาณ</li>
                <li><strong>Read Waveform Data:</strong> ดึงชุดข้อมูลที่บันทึกได้ขึ้นมาแปลงผ่านคณิตศาสตร์วิเคราะห์ (เช่น ทำ FFT หาความเพี้ยนรวม THD)</li>
                <li><strong>Publish Results:</strong> ส่งตัวเลขผลลัพธ์ผลวิเคราะห์ที่ได้รายงานผลเข้า TestStand</li>
            </ol>

            <div class="tip-block">
                <div class="tip-block-title">💡 การเขียน C# ร่วมกับ DAQmx API</div>
                <p>ในการเขียนโปรแกรมคุม DAQ ในเทมเพลต ADI จะใช้งานผ่านไดรเวอร์ <code>NIDAQmxTask</code> ซึ่งระบุขอบเขตการทำงานร่วมกับ Pin Map ในระดับ Abstraction คล้ายคลึงกับคำสั่งวัดแรงดันกระแสตรงของบอร์ด SMU</p>
            </div>
        `,
        code: `// ตัวอย่างโครงสร้างโค้ดการประกาศดึงงาน Task DAQ อนาล็อกขาเข้า
DAQmxTaskSessionsBundle daqTask = sessionManager.DAQmxTask("DAQ_6368_AI");

// 1. สั่งรันสตาร์ทงานการ์ดเพื่อเตรียมรับข้อมูล
daqTask.Start();

// 2. ดึงค่าชุดสัญญาณที่จับได้ (Waveform Data) ขึ้นมาระดับ C# เพื่อวิเคราะห์
SiteData<AnalogWaveform<double>> capturedWaveforms = daqTask.Read();

// 3. ปิดเคลียร์งานเพื่อประหยัดหน่วยความจำ
daqTask.Stop();`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- Analog Input wave source -->
                <path d="M10 100 Q 30 50, 50 100 T 90 100 T 130 100" style="fill:none; stroke: #3b82f6; stroke-width: 2;" />
                <text x="65" y="130" class="dia-text-sub">Analog Waveform (AC)</text>
                
                <path d="M100 100h30" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- DAQ Card (PXIe-6368) -->
                <rect x="130" y="55" width="110" height="90" class="dia-box active" />
                <text x="185" y="80" class="dia-text" style="fill: #2b5c8f;">DAQ Card</text>
                <text x="185" y="95" class="dia-text-sub">(Analog to Digital)</text>
                <text x="185" y="115" class="dia-text" style="font-size: 8px;">สุ่มบันทึก: 2 MS/s</text>
                
                <path d="M240 100h40" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Digital calculation block -->
                <rect x="280" y="55" width="100" height="90" class="dia-box" style="fill: #f1f5f9; stroke: #64748b;" />
                <text x="330" y="80" class="dia-text">C# DSP Code</text>
                <text x="330" y="95" class="dia-text-sub">(คำนวณคณิตศาสตร์)</text>
                <text x="330" y="115" class="dia-text" style="font-size: 8px; fill: #b91c1c;">แปลง FFT / THD</text>
                <text x="330" y="130" class="dia-text" style="font-size: 8px; fill: #b91c1c;">คำนวณหา Noise</text>
            </svg>
        `
    },
    test_workflow: {
        module: "Module 3: Advanced Execution",
        title: "10. Workflow ของ Test Code",
        narrative: `
            <h4>ภาพรวมลำดับการทำงานตั้งแต่เริ่มเปิดตู้จนจบการทดสอบชิป</h4>
            <p>นี่คือลำดับเหตุการณ์การทำงานจริง (Execution Workflow) ที่ระบบ STS และ C# Code Module ดำเนินการประสานงานส่งต่อข้อมูลกันในสายการผลิตจริงแบบเป็นลำดับขั้นตอน:</p>
            
            <h4>ไทม์ไลน์การทดสอบตั้งแต่เริ่มยันจบ:</h4>
            <ol>
                <li><strong>ProcessSetup (เริ่มรันล็อต):</strong> TestStand โหลดไฟล์ลำดับการทดสอบ <code>.seq</code> และจับคู่แผนผังพิน <code>.pinmap</code> จากนั้นระบบ TSM ทำการเปิดจองเซสชันบอร์ดการ์ดต่างๆ</li>
                <li><strong>Setup Group (เตรียมบอร์ด/ชิป):</strong> สั่งการ์ดจ่ายแรงดันไฟเลี้ยงตัวชิปหลัก (DUT Power-up) เพื่อกระตุ้นให้วงจรทำงาน และสั่งเปิดสวิตช์รีเลย์เชื่อมสายทั้งหมด</li>
                <li><strong>Main Group (ขั้นตอนเทสหลัก):</strong> เทสสเตปย่อยจะเรียกฟังก์ชัน C# ในไฟล์ DLL เพื่อรันการตรวจจับไฟฟ้า (Force -> Delay -> Measure -> Publish) แล้วคืนค่าส่งขึ้นมาเปรียบเกณฑ์ Pass/Fail ใน TestStand</li>
                <li><strong>Cleanup Group (คืนสถานะปลอดภัย):</strong> บังคับระดับแรงดันพินกลับมาเป็นสถานะปลอดภัย (0V หรือ Hi-Z) เพื่อลดโอกาสหัวเข็มเสียหายจากไฟฟ้าเกินชั่วขณะ (EOS) ตอนหุ่นยนต์ดึงชิปออก</li>
                <li><strong>ProcessCleanup (สิ้นสุดล็อต):</strong> สรุปยอดประเมินชิป (Binning) บันทึกสถิติลงรายงาน (STDF File) และปิดเซสชันบอร์ดทั้งหมด</li>
            </ol>

            <h4>เคล็ดลับวิศวกร: วิธีการดีบั๊ก (Debug) C# Code Modules ใน TestStand:</h4>
            <p>ในการเขียนเทสบน Visual Studio คุณสามารถดีบั๊กโค้ดทีละบรรทัดเพื่อดูค่าตัวแปรในเวลาทำงานจริง (Runtime) ได้ตามขั้นตอนนี้:</p>
            <ul>
                <li>เปิดโปรแกรม TestStand Sequence Editor (<code>SeqEdit.exe</code>) และเปิดโปรแกรม Visual Studio ที่มีซอร์สโค้ดของคุณ</li>
                <li>ใน Visual Studio ให้ไปที่เมนู <strong>Debug -> Attach to Process...</strong></li>
                <li>ค้นหาโปรเซสชื่อ <strong><code>SeqEdit.exe</code></strong> (หรือ <code>TestStand.exe</code> ขึ้นอยู่กับโปรแกรมรันตัวหลัก) แล้วกดปุ่ม <strong>Attach</strong></li>
                <li>เมื่อทำการตั้ง Breakpoint บนซอร์สโค้ด C# และกดกดรัน Sequence ใน TestStand เมื่อโปรแกรมรันมาถึงสเตปที่คุณเรียกใช้ มันจะหยุดชั่วขณะและสลับหน้าต่างมาที่ Visual Studio ให้คุณทำการ Inspect ค่าตัวแปรได้ทันทีครับ</li>
            </ul>
        `,
        code: `// ไฮไลท์การแบ่งกลุ่มสเตปการทำงานจริงในส่วนของ C# โค้ดโมดูล
public static void TS_TestSequence(ISemiconductorModuleContext tsmContext)
{
    // 1. Setup: สร้างการจองเซสชัน
    var sessionManager = new TSMSessionManager(tsmContext);
    
    // 2. Main: รันขั้นตอนจ่ายกระแสวัดค่า
    var smuPins = sessionManager.DCPower("SupplyPins");
    smuPins.ForceVoltage(3.3, 0.05);
    smuPins.MeasureAndPublishCurrent("LeakageCurrent");
    
    // 3. Cleanup: ปิดไฟเลี้ยงก่อนจบรันชิ้นงานชิ้นนี้
    smuPins.ForceVoltage(0, 0.01);
}`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- Timeline sequence -->
                <g transform="translate(10, 10)">
                    <rect x="0" y="10" width="70" height="40" class="dia-box" />
                    <text x="35" y="30" class="dia-text" style="font-size: 8px;">1. ProcessSetup</text>
                    <text x="35" y="42" class="dia-text-sub" style="font-size: 7px;">โหลดตั้งค่าบอร์ด</text>
                    
                    <path d="M70 30h15" class="dia-arrow" marker-end="url(#arrow)" />
                    
                    <rect x="85" y="10" width="70" height="40" class="dia-box" />
                    <text x="120" y="30" class="dia-text" style="font-size: 8px;">2. Setup</text>
                    <text x="120" y="42" class="dia-text-sub" style="font-size: 7px;">ต่อรีเลย์/จ่ายไฟ</text>
                    
                    <path d="M155 30h15" class="dia-arrow" marker-end="url(#arrow)" />
                    
                    <rect x="170" y="10" width="80" height="40" class="dia-box active" />
                    <text x="210" y="30" class="dia-text" style="font-size: 8px; fill: #2b5c8f;">3. Main (C# Code)</text>
                    <text x="210" y="42" class="dia-text-sub" style="font-size: 7px;">เทส/วัดค่า/บันทึกผล</text>
                    
                    <path d="M250 30h15" class="dia-arrow" marker-end="url(#arrow)" />
                    
                    <rect x="265" y="10" width="70" height="40" class="dia-box" />
                    <text x="300" y="30" class="dia-text" style="font-size: 8px;">4. Cleanup</text>
                    <text x="300" y="42" class="dia-text-sub" style="font-size: 7px;">เซ็ตปลอดภัย 0V</text>
                    
                    <path d="M335 30h15" class="dia-arrow" marker-end="url(#arrow)" />
                    
                    <rect x="350" y="10" width="30" height="40" class="dia-box" style="fill: #e2e8f0; stroke: #64748b;" />
                    <text x="365" y="30" class="dia-text" style="font-size: 7px;">5. Post</text>
                    <text x="365" y="42" class="dia-text-sub" style="font-size: 6px;">รายงาน STDF</text>
                </g>
                
                <rect x="50" y="80" width="300" height="110" class="dia-box" style="fill: #f0fdf4; stroke: #10b981;" />
                <text x="200" y="102" class="dia-text" style="fill: #065f46; font-size: 11px;">ระยะที่สำคัญสูงสุดของวิศวกร: ขั้นตอน Main</text>
                <text x="200" y="125" class="dia-text-sub" style="fill: #047857; text-anchor: middle;">1. Force สัญญาณไฟเข้าชิปเป้าหมาย</text>
                <text x="200" y="145" class="dia-text-sub" style="fill: #047857; text-anchor: middle;">2. ดีเลย์ชั่วครู่เพื่อรอให้ประจุไฟฟ้านิ่งเสถียร</text>
                <text x="200" y="165" class="dia-text-sub" style="fill: #047857; text-anchor: middle;">3. วัดและรายงานผลลัพธ์กลับสู่ TestStand</text>
            </svg>
        `
    },
    parallel_exec: {
        module: "Module 3: Advanced Execution",
        title: "11. Parallel Execution",
        narrative: `
            <h4>การเร่งความเร็วในการรันงานด้วยคำสั่ง InvokeInParallel</h4>
            <p>เพื่อช่วยประหยัดเวลารันเทสชิป (Test Time) ให้เร็วที่สุด เฟรมเวิร์กของ ADI และ TSM จะมีฟังก์ชันช่วยเหลือสำหรับแยกสั่งงานบอร์ดขนานไปพร้อมกันบนซีพียูแยกเธรด นั่นคือคำสั่ง **<code>InvokeInParallel</code>**</p>
            
            <h4>การประยุกต์ใช้งานในโค้ด C# ของคุณ:</h4>
            <ul>
                <li><strong>สถานการณ์จริง:</strong> บอร์ดเครื่องวัดฝั่ง SMU และการ์ดดิจิทัล PPMU ไม่มีฮาร์ดแวร์ขั้วเชื่อมโยงถึงกัน ดังนั้นเวลาส่งคำสั่ง สองฝั่งนี้ควรจะรันไปพร้อมๆ กันเพื่อไม่ให้เสียเวลาตั้งค่าแบบต่อคิวทีละบอร์ด</li>
                <li><strong>วิธีทำงาน:</strong> โค้ดจะนำคำสั่งของฝั่ง SMU ใส่ไว้ใน Actions ชุดที่ 1 และนำคำสั่งฝั่งดิจิทัลใส่ไว้ใน Actions ชุดที่ 2 ตัวประมวลผลของ <code>InvokeInParallel</code> จะทำการสร้างเธรดแยก และดันคำสั่งไปรันงานที่บอร์ดการ์ดทั้งสองฝั่งพร้อมกันในเสี้ยววินาที</li>
            </ul>
        `,
        code: `// ตัวอย่างโค้ดจริงในโปรเจกต์ที่สั่งงานการตั้งค่าคู่ขนานกันข้ามบอร์ด (จาก Continuity.cs)
InvokeInParallel(
    // 🟢 เธรดที่ 1: ตั้งค่าจ่ายไฟ 0V ให้พิน SMU ทั้งหมด
    () => {
        if (smuSupplyPins.Length > 0) {
            sessionManager.DCPower(smuSupplyPins).ForceVoltage(0, setting.CurrentLimit);
        }
    },
    // 🔵 เธรดที่ 2: ตั้งค่าจ่ายไฟ 0V ให้พินดิจิทัลทั้งหมด
    () => {
        if (pmuSupplyPins.Length > 0) {
            sessionManager.Digital(pmuSupplyPins).ForceVoltage(0, setting.CurrentLimit);
        }
    }
);`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- InvokeInParallel start -->
                <rect x="140" y="10" width="120" height="35" class="dia-box active" />
                <text x="200" y="32" class="dia-text" style="fill: #2b5c8f;">InvokeInParallel</text>
                
                <!-- Split arrows -->
                <path d="M140 27h-60v35" class="dia-arrow" marker-end="url(#arrow)" />
                <path d="M260 27h60v35" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Parallel Threads -->
                <rect x="20" y="65" width="130" height="60" class="dia-box" style="fill: #f0fdf4; stroke: #10b981;" />
                <text x="85" y="85" class="dia-text" style="fill: #065f46;">เธรดที่ 1 (Thread 1)</text>
                <text x="85" y="100" class="dia-text-sub" style="fill: #047857;">สั่งการบอร์ด DCPower (SMU)</text>
                <text x="85" y="112" class="dia-text-sub" style="fill: #047857;">ให้สับรีเลย์จ่ายไฟ</text>
                
                <rect x="250" y="65" width="130" height="60" class="dia-box" style="fill: #eff6ff; stroke: #3b82f6;" />
                <text x="315" y="85" class="dia-text" style="fill: #1e3a8a;">เธรดที่ 2 (Thread 2)</text>
                <text x="315" y="100" class="dia-text-sub" style="fill: #1d4ed8;">สั่งการบอร์ดดิจิทัล (PPMU)</text>
                <text x="315" y="112" class="dia-text-sub" style="fill: #1d4ed8;">ให้ตั้งค่าพารามิเตอร์วัดค่า</text>
                
                <!-- Join arrows -->
                <path d="M85 125v35h75" class="dia-arrow" />
                <path d="M315 125v35h-75" class="dia-arrow" />
                
                <!-- Synchronization point -->
                <rect x="140" y="160" width="120" height="30" class="dia-box" style="fill: #f1f5f9; stroke: #64748b;" />
                <text x="200" y="178" class="dia-text" style="fill: #334155;">ประสานเวลารอกัน (Sync)</text>
                <text x="200" y="188" class="dia-text-sub">รอจนงานของทั้ง 2 เธรดเสร็จสิ้น</text>
            </svg>
        `
    },
    publish_results: {
        module: "Module 3: Advanced Execution",
        title: "12. Publish Results",
        narrative: `
            <h4>การวัดค่าและการส่งรายงานผลลัพธ์ย้อนกลับเข้า TestStand</h4>
            <p>เมื่อเครื่องวัดการ์ดฮาร์ดแวร์ทำงานตรวจจับระดับแรงดันกระแสไฟตรงของชิปเรียบร้อยแล้ว ขั้นตอนการนำค่าวัดที่ได้ส่งรายงานผลไปให้ TestStand ตัดสินและออกรายงาน Datalog จะใช้คำสั่งกลุ่ม **<code>Measure and Publish</code>**</p>
            
            <h4>ขั้นตอนการทำงานเบื้องหลังของคำสั่ง:</h4>
            <ul>
                <li><strong>เรียกใช้คำสั่งระดับสูง:</strong> โค้ด C# เรียกเมธอด เช่น <code>smuPins.MeasureAndPublishVoltage("CS_Voltage")</code> หรือ <code>MeasureAndPublishCurrent("Leakage")</code></li>
                <li><strong>เก็บค่าวัดแยกไซต์:</strong> ตัว Bundle จะอ่านกระแสไฟฟ้า/แรงดันที่ขั้ววัดกลับเข้ามาเป็นกล่องข้อมูลประเภท <code>SiteData</code> หรือ <code>PinSiteData</code> แยกตามชิปแต่ละไซต์โดยตรง</li>
                <li><strong>ส่งข้อมูลกลับ:</strong> ยิงค่าตารางข้อมูลเหล่านั้นส่งผ่าน TSM Context กลับขึ้นไปให้ TestStand</li>
                <li><strong>วิเคราะห์ตัดสิน:</strong> TestStand จะดึงค่านี้ไปเช็คขอบเขตเกณฑ์ Limits ที่เราตั้งค่าไว้ (เช่น ค่าจำกัดห้ามต่ำกว่า 2.8V และห้ามสูงกว่า 3.5V) หากผ่านจะขึ้นสถานะ PASS หากตกเกณฑ์จะขึ้นสถานะ FAIL ทันที</li>
            </ul>
        `,
        code: `// การวัดแรงดันไฟและรายงานผลลัพธ์ในบรรทัดเดียว (จาก Continuity.cs)
for (int i = 0; i < dcPowerTestPins.Count; i++)
{
    DCPowerSessionsBundle pinSession = sessionManager.DCPower(dcPowerTestPins[i]);                
    pinSession.ForceCurrent(dcPowerTestLevels[i], smuPinVoltageLimit, waitForSourceCompletion: true);
    
    // ทำการวัดค่าแรงดันและส่งกลับรายงานไปที่ TestStand ทันทีภายใต้ชื่อ ID "dcPowerPublishIDs"
    pinSession.MeasureAndPublishVoltage(dcPowerPublishIDs[i]);
}`,
        diagram: `
            <svg viewBox="0 0 400 220" width="100%" height="100%" class="diagram-svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                    </marker>
                </defs>
                <!-- C# Measurement -->
                <rect x="20" y="40" width="110" height="50" class="dia-box active" />
                <text x="75" y="65" class="dia-text" style="fill: #2b5c8f; font-size: 9px;">MeasureAndPublish</text>
                <text x="75" y="78" class="dia-text-sub" style="font-size: 8px;">(C# Code Module)</text>
                
                <path d="M130 65h50" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- TestStand Limits Check -->
                <rect x="180" y="30" width="110" height="70" class="dia-box" style="fill: #fffbeb; stroke: #f59e0b;" />
                <text x="235" y="52" class="dia-text" style="fill: #d97706; font-size: 10px;">TestStand Limits</text>
                <text x="235" y="68" class="dia-text-sub" style="font-size: 8px; fill: #b45309;">ขอบเขต: LL=2.8V, UL=3.5V</text>
                <text x="235" y="82" class="dia-text" style="font-size: 8px; fill: #b45309;">เทียบค่าวัดจริง 3.2V</text>
                
                <path d="M290 65h50" class="dia-arrow" marker-end="url(#arrow)" />
                
                <!-- Final status -->
                <rect x="340" y="50" width="45" height="30" class="dia-box" style="fill: #d1fae5; stroke: #10b981;" />
                <text x="362.5" y="70" class="dia-text" style="fill: #065f46; font-size: 10px; text-anchor: middle;">PASS</text>
                
                <!-- Bottom datalog status -->
                <rect x="80" y="140" width="240" height="40" class="dia-box" style="fill: #f1f5f9; stroke: #64748b;" />
                <text x="200" y="158" class="dia-text" style="fill: #334155; font-size: 10px;">เก็บสถิติลง Datalog (STDF File)</text>
                <text x="200" y="172" class="dia-text-sub">เพื่อสรุปผลผลิตชิ้นงานเมื่อจบการทดสอบทั้งล็อต</text>
            </svg>
        `
    }
};

// ==========================================================================
// Application Controller
// ==========================================================================
let activeTopicKey = 'stl_intro';
let completedTopics = {};

document.addEventListener('DOMContentLoaded', () => {
    // Load progress from local storage
    loadProgress();
    
    // Load sidebar state from local storage
    const sidebarCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    if (sidebarCollapsed) {
        document.querySelector('.app-layout').classList.add('sidebar-collapsed');
    }
    
    // Switch to first topic
    switchSyllabus(activeTopicKey);

    // Search bar logic
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        filterSyllabus(e.target.value);
    });
});

// Load progress from local storage
function loadProgress() {
    const saved = localStorage.getItem('ate_training_completed_topics');
    if (saved) {
        completedTopics = JSON.parse(saved);
        // Check corresponding checkboxes
        for (const [key, isDone] of Object.entries(completedTopics)) {
            const chk = document.getElementById(`chk-${key}`);
            if (chk) chk.checked = isDone;
        }
    }
    updateProgressBar();
}

// Save progress to local storage
function saveProgress() {
    localStorage.setItem('ate_training_completed_topics', JSON.stringify(completedTopics));
    updateProgressBar();
}

// Calculate and update the progress bar percentages
function updateProgressBar() {
    const total = Object.keys(syllabusData).length;
    const completedCount = Object.values(completedTopics).filter(Boolean).length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    
    document.getElementById('progress-percent').innerText = `${percent}%`;
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('progress-count').innerText = `เรียนรู้แล้ว ${completedCount} จาก ${total} หัวข้อ`;
}

// Switch between topics
function switchSyllabus(key) {
    const topic = syllabusData[key];
    if (!topic) return;

    activeTopicKey = key;

    // Update navigation active class
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeItem = document.getElementById(`nav-${key}`);
    if (activeItem) activeItem.classList.add('active');

    // Update Header
    document.getElementById('topic-module-badge').innerText = topic.module;
    document.getElementById('topic-title').innerText = topic.title;

    // Update Core Narrative Content
    document.getElementById('lesson-content-area').innerHTML = topic.narrative;

    // Update Code Snippet
    const codeArea = document.getElementById('code-snippet-area');
    codeArea.innerHTML = highlightCSharp(topic.code);

    // Update Diagram SVG
    document.getElementById('diagram-area').innerHTML = topic.diagram;

    // Update button states
    updateNavButtons();

    // Reset and Load Quiz for this topic
    if (typeof resetAndLoadQuiz === 'function') {
        resetAndLoadQuiz(topic);
    }

    // Scroll to top of content area
    document.getElementById('lesson-content-area').scrollTop = 0;
}

// Robust C# Syntax highlighter using token placeholders to prevent double-replacements
function highlightCSharp(codeText) {
    let escaped = codeText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    let placeholders = [];
    let placeholderCounter = 0;

    // 1. Extract Comments to placeholders
    escaped = escaped.replace(/(\/\/.*)/g, (match) => {
        let ph = `___PH_COMMENT_${placeholderCounter++}___`;
        placeholders.push({ placeholder: ph, content: `<span style="color: #64748b; font-style: italic;">${match}</span>` });
        return ph;
    });

    // 2. Extract Strings to placeholders
    escaped = escaped.replace(/"([^"\\]|\\.)*"/g, (match) => {
        let ph = `___PH_STRING_${placeholderCounter++}___`;
        placeholders.push({ placeholder: ph, content: `<span style="color: #34d399;">${match}</span>` });
        return ph;
    });

    // 3. Extract Numeric constants to placeholders (safe now because strings & comments are removed)
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, (match) => {
        let ph = `___PH_NUM_${placeholderCounter++}___`;
        placeholders.push({ placeholder: ph, content: `<span style="color: #fb923c;">${match}</span>` });
        return ph;
    });

    // 4. Highlight Keywords
    const keywords = [
        "using", "namespace", "class", "public", "static", "void", "out",
        "string", "double", "var", "new", "foreach", "in", "if", "return",
        "struct", "partial", "private", "const", "for", "int", "true", "false",
        "Dictionary", "List"
    ];
    keywords.forEach(kw => {
        let regex = new RegExp(`\\b${kw}\\b`, "g");
        escaped = escaped.replace(regex, `<span style="color: #f43f5e; font-weight: 600;">${kw}</span>`);
    });

    // 5. Highlight Types / Classes in NI/ADI STL
    const types = [
        "ISemiconductorModuleContext", "NIDCPower", "TSMSessionManager", 
        "PrecisionTimeSpan", "DCPowerSessionsBundle", "DigitalSessionsBundle", 
        "DCPowerMeasureSettings", "ContinuitySupplySettings", "ContinuityPinSettings",
        "ContinuityTestConditions", "PPMUSettings", "DCPowerSourceSettings",
        "SiteData", "PinSiteData", "DmmSessionsBundle", "DAQmxTaskSessionsBundle",
        "AnalogWaveform"
    ];
    types.forEach(typ => {
        let regex = new RegExp(`\\b${typ}\\b`, "g");
        escaped = escaped.replace(regex, `<span style="color: #38bdf8; font-weight: 500;">${typ}</span>`);
    });

    // 6. Restore all placeholders in reverse order (to handle nested placeholders properly if any, though not nested here)
    for (let i = placeholders.length - 1; i >= 0; i--) {
        const item = placeholders[i];
        escaped = escaped.replace(item.placeholder, item.content);
    }

    return escaped;
}

// Navigation between next/prev buttons
function navigateTopic(direction) {
    const keys = Object.keys(syllabusData);
    const currentIndex = keys.indexOf(activeTopicKey);
    let nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < keys.length) {
        switchSyllabus(keys[nextIndex]);
    }
}

// Enable/Disable next/prev button styling
function updateNavButtons() {
    const keys = Object.keys(syllabusData);
    const currentIndex = keys.indexOf(activeTopicKey);
    
    document.getElementById('btn-prev').disabled = currentIndex === 0;
    document.getElementById('btn-next').disabled = currentIndex === keys.length - 1;

    // Update the Mark Complete button status
    const btn = document.getElementById('btn-complete-toggle');
    if (completedTopics[activeTopicKey]) {
        btn.innerText = "✓ เรียนรู้เรียบร้อยแล้ว";
        btn.className = "btn btn-success";
    } else {
        btn.innerText = "ทำเครื่องหมายว่าเรียนรู้แล้ว";
        btn.className = "btn btn-outline";
    }
}

// Handle checkbox clicks in the sidebar list
function toggleComplete(key, event) {
    // Stop event propagation to avoid switching tab
    if (event) event.stopPropagation();

    const chk = document.getElementById(`chk-${key}`);
    completedTopics[key] = chk.checked;
    saveProgress();
    updateNavButtons();
    
    if (typeof syncQuizStateWithCompletion === 'function' && key === activeTopicKey) {
        syncQuizStateWithCompletion();
    }
}

// Mark current active topic as complete
function markCurrentTopicComplete() {
    const isCompleted = !completedTopics[activeTopicKey];
    completedTopics[activeTopicKey] = isCompleted;
    
    // Check or uncheck sidebar box
    const chk = document.getElementById(`chk-${activeTopicKey}`);
    if (chk) chk.checked = isCompleted;

    saveProgress();
    updateNavButtons();

    if (typeof syncQuizStateWithCompletion === 'function') {
        syncQuizStateWithCompletion();
    }
}

// Filter the sidebar syllabus navigation list based on search
function filterSyllabus(query) {
    const lowercaseQuery = query.toLowerCase();
    
    for (const [key, topic] of Object.entries(syllabusData)) {
        const item = document.getElementById(`nav-${key}`);
        if (!item) continue;

        const textMatches = topic.title.toLowerCase().includes(lowercaseQuery) || 
                            topic.narrative.toLowerCase().includes(lowercaseQuery) ||
                            topic.code.toLowerCase().includes(lowercaseQuery);
        
        if (textMatches) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    }
}

// Toggle sidebar state and save it in localStorage
function toggleSidebar(collapse) {
    const layout = document.querySelector('.app-layout');
    if (collapse) {
        layout.classList.add('sidebar-collapsed');
        localStorage.setItem('sidebar_collapsed', 'true');
    } else {
        layout.classList.remove('sidebar-collapsed');
        localStorage.setItem('sidebar_collapsed', 'false');
    }
}

// ==========================================================================
// Interactive Quiz System
// ==========================================================================
const quizQuestions = {
    stl_intro: {
        question: "ในการนำ STL เข้ามาใช้งานในโปรเจกต์ Visual Studio ต้องอิมพอร์ต Namespace หลักของ NI ที่เป็น Abstraction ชื่อว่าอะไร?",
        answerRegex: /NationalInstruments\.SemiconductorTestLibrary/i,
        hint: "สะกดด้วย: NationalInstruments.SemiconductorTestLibrary",
        solution: "NationalInstruments.SemiconductorTestLibrary"
    },
    abstraction: {
        question: "ข้อดีของการทำ Instrument Abstraction คือเมื่อเปลี่ยนสล็อตหรือรุ่นของบอร์ดเครื่องวัด เราต้องเข้าไปแก้ไขที่ไฟล์นามสกุลอะไร โดยไม่ต้องแก้โค้ด C#?",
        answerRegex: /(\.pinmap|pinmap)/i,
        hint: "เป็นไฟล์ที่ใช้จับคู่พินกับฮาร์ดแวร์จริง มีนามสกุลไฟล์เป็น .pinmap",
        solution: "ไฟล์ Pin Map (.pinmap)"
    },
    session_manager: {
        question: "คลาสหลักใน STL C# ที่ทำหน้าที่สืบค้นแผนผังพินและเชื่อมต่อไปยังบอร์ดจริงผ่าน tsmContext คือคลาสใด?",
        answerRegex: /TSMSessionManager/i,
        hint: "สะกดชื่อคลาส: TSMSessionManager",
        solution: "TSMSessionManager"
    },
    session_bundle: {
        question: "ในการคุมบอร์ด SMU (DCPower) พร้อมกันหลายไซต์ในคำสั่งเดียว STL จะคืนเซสชันบอร์ดเหล่านั้นออกมาในรูปมัดรวม (Bundle) ชื่อว่าอะไร?",
        answerRegex: /DCPowerSessionsBundle/i,
        hint: "คำตอบคือ DCPowerSessionsBundle",
        solution: "DCPowerSessionsBundle"
    },
    sitedata: {
        question: "หากต้องการบันทึกค่าวัดละเอียดแยกขาพินรายชิ้นชิป (เช่น ขา SCLK, ขา CS) ควรใช้อ็อบเจกต์ประเภทใดระหว่าง SiteData หรือ PinSiteData?",
        answerRegex: /PinSiteData/i,
        hint: "สะกดสะกด: PinSiteData",
        solution: "PinSiteData"
    },
    dcpower_flow: {
        question: "ใน DCPower Flow (SMU) การตั้งค่าใดที่ช่วยหน่วงเวลารอประจุเสถียรเพื่อข้ามสัญญาณกวนชั่วคราว (Transient) ก่อนเริ่มอ่านค่ากระแส?",
        answerRegex: /(Source Delay|Delay|หน่วงเวลา)/i,
        hint: "สะกดสะกด: Source Delay",
        solution: "Source Delay"
    },
    digital_flow: {
        question: "โมดูลวัดขนาดจิ๋วที่อยู่ภายในบอร์ดดิจิทัล PXIe-6571 สำหรับใช้จ่าย/วัดค่ากระแสแรงดันพารามิเตอร์ละเอียด เรียกว่าอะไร?",
        answerRegex: /PPMU/i,
        hint: "ตัวย่อภาษาอังกฤษ 4 ตัวใหญ่: PPMU",
        solution: "PPMU"
    },
    dmm_flow: {
        question: "แม้ DMM จะวัดได้แม่นยำสูงมาก แต่ข้อจำกัดใดทำให้มักไม่ถูกใช้ประมวลผลพร้อมกันหลายพินในการทดสอบแบบ Multisite ขนาดใหญ่?",
        answerRegex: /(แชนเนลน้อย|แชนเนลจำกัด|ช้า|Serial|ทีละพิน|ทีละตัว)/i,
        hint: "เพราะบอร์ดมีช่องสัญญาณแชร์กันจำกัด ทำให้ต้องวัดแบบทีละตัว (Serial) ไม่เหมือน SMU/Digital ที่รันขนานกันได้",
        solution: "บอร์ด DMM มีจำนวนแชนเนลจำกัดมาก จึงต้องวัดไล่ไปทีละช่องสัญญาณ (Serial Execution) ขนานกันไม่ได้"
    },
    daq_flow: {
        question: "คลาสเซสชันในการควบคุมมัดรวมการทำงานของการ์ด DAQmx เพื่ออ่านสัญญาณรูปแบบ Waveform ความเร็วสูงมีชื่อว่าอะไร?",
        answerRegex: /DAQmxTaskSessionsBundle/i,
        hint: "คำตอบคือ DAQmxTaskSessionsBundle",
        solution: "DAQmxTaskSessionsBundle"
    },
    test_workflow: {
        question: "ใน Workflow จริงของ Test Code หลังเปิดเซสชันและต่อรีเลย์ (Connect) แล้ว ลำดับถัดมาคือขั้นตอนใดก่อนจะสั่งให้ชิปทำงาน?",
        answerRegex: /(Force Voltage|Force|จ่ายไฟ)/i,
        hint: "เป็นการจ่ายพลังงานเลี้ยงขาไฟหลัก (Force Voltage / Force Current)",
        solution: "Force Voltage / Force Current (การตั้งค่าแหล่งจ่ายและเปิดการปล่อยระดับไฟเลี้ยง)"
    },
    parallel_exec: {
        question: "การสั่งงานเครื่องวัดต่างประเภทพร้อมกันข้ามบอร์ดโดยไม่ต้องต่อคิวรอสัญญาณกัน เรียกว่าการรันแบบใด?",
        answerRegex: /(Parallel|ขนาน)/i,
        hint: "การประมวลผลแบบขนาน (Parallel Execution)",
        solution: "Parallel Execution (การรันประมวลผลแบบขนาน)"
    },
    publish_results: {
        question: "เมธอดใน STL ที่ช่วยประหยัดบรรทัดโค้ดโดยทำหน้าที่ทั้งรันวัดค่าระดับแรงดันและนำส่งผลทดสอบรายงานไปยัง TestStand ทันทีคือเมธอดชื่อว่าอะไร?",
        answerRegex: /(MeasureAndPublish|MeasureAndPublishVoltage)/i,
        hint: "สะกด: MeasureAndPublish หรือ MeasureAndPublishVoltage",
        solution: "MeasureAndPublish (เช่น MeasureAndPublishVoltage)"
    }
};

// Merge quiz data into main database
Object.keys(quizQuestions).forEach(key => {
    if (syllabusData[key]) {
        syllabusData[key].quiz = quizQuestions[key];
    }
});

// Reset and load quiz layout
function resetAndLoadQuiz(topic) {
    const userInput = document.getElementById('quiz-user-input');
    const feedbackArea = document.getElementById('quiz-feedback-area');
    const questionText = document.getElementById('quiz-question-text');
    const quizBlock = document.getElementById('quiz-block');
    
    if (!userInput || !feedbackArea || !questionText || !quizBlock) return;

    userInput.value = '';
    userInput.disabled = false;
    feedbackArea.style.display = 'none';
    feedbackArea.className = 'quiz-feedback';
    feedbackArea.innerHTML = '';

    if (topic && topic.quiz) {
        quizBlock.style.display = 'flex';
        questionText.innerText = topic.quiz.question;
        
        // If the topic is already marked completed, show success feedback
        if (completedTopics[activeTopicKey]) {
            userInput.disabled = true;
            userInput.value = topic.quiz.solution;
            feedbackArea.style.display = 'block';
            feedbackArea.className = 'quiz-feedback success';
            feedbackArea.innerHTML = '<strong>✓ คุณผ่านแบบทดสอบของหัวข้อนี้แล้ว!</strong>';
        }
    } else {
        quizBlock.style.display = 'none';
    }
}

// Sync quiz block state with manual completions
function syncQuizStateWithCompletion() {
    const isCompleted = completedTopics[activeTopicKey];
    const userInput = document.getElementById('quiz-user-input');
    const feedbackArea = document.getElementById('quiz-feedback-area');
    const topic = syllabusData[activeTopicKey];
    
    if (!userInput || !feedbackArea || !topic || !topic.quiz) return;

    if (isCompleted) {
        userInput.disabled = true;
        userInput.value = topic.quiz.solution;
        feedbackArea.style.display = 'block';
        feedbackArea.className = 'quiz-feedback success';
        feedbackArea.innerHTML = '<strong>✓ คุณผ่านแบบทดสอบของหัวข้อนี้แล้ว!</strong>';
    } else {
        userInput.disabled = false;
        userInput.value = '';
        feedbackArea.style.display = 'none';
        feedbackArea.className = 'quiz-feedback';
        feedbackArea.innerHTML = '';
    }
}

// Check the typed answer
function checkQuizAnswer() {
    const userInputField = document.getElementById('quiz-user-input');
    const feedbackArea = document.getElementById('quiz-feedback-area');
    
    if (!userInputField || !feedbackArea) return;

    const userInput = userInputField.value.trim();
    if (!userInput) {
        showFeedback('info', '💡 กรุณาพิมพ์คำตอบลงในช่องว่างก่อนส่งคำตอบครับ');
        return;
    }

    const topic = syllabusData[activeTopicKey];
    if (!topic || !topic.quiz) return;

    const isCorrect = topic.quiz.answerRegex.test(userInput);

    if (isCorrect) {
        userInputField.disabled = true;
        showFeedback('success', `<strong>🎉 ถูกต้องแล้วครับ!</strong> คำตอบคือ "${topic.quiz.solution}"<br>ระบบทำการเช็คเครื่องหมายผ่านบทเรียนนี้ให้คุณเรียบร้อยแล้วครับ!`);
        
        // Auto-complete the active syllabus topic
        completedTopics[activeTopicKey] = true;
        const chk = document.getElementById(`chk-${activeTopicKey}`);
        if (chk) chk.checked = true;
        saveProgress();
        updateNavButtons();
    } else {
        showFeedback('error', '<strong>❌ คำตอบยังไม่ถูกต้องครับ!</strong> ลองพิมพ์ตรวจสอบตัวสะกดหรือกดปุ่มด้านล่างเพื่อดูคำใบ้หรือเฉลยดูนะครับ');
    }
}

// Show feedback helper
function showFeedback(type, htmlContent) {
    const feedbackArea = document.getElementById('quiz-feedback-area');
    if (!feedbackArea) return;

    feedbackArea.style.display = 'block';
    feedbackArea.className = `quiz-feedback ${type}`;
    feedbackArea.innerHTML = htmlContent;
}

// Show quiz hint
function showQuizHint() {
    const topic = syllabusData[activeTopicKey];
    if (!topic || !topic.quiz) return;
    showFeedback('info', `<strong>💡 คำใบ้:</strong> ${topic.quiz.hint}`);
}

// Show quiz solution
function showQuizSolution() {
    const topic = syllabusData[activeTopicKey];
    if (!topic || !topic.quiz) return;
    
    const userInputField = document.getElementById('quiz-user-input');
    if (userInputField) {
        userInputField.value = topic.quiz.solution;
        userInputField.disabled = true;
    }
    
    showFeedback('success', `<strong>🔑 เฉลยคือ:</strong> "${topic.quiz.solution}"<br>ระบบบันทึกผลว่าผ่านแบบทดสอบนี้ให้แล้วครับ`);
    
    // Auto-complete the active syllabus topic
    completedTopics[activeTopicKey] = true;
    const chk = document.getElementById(`chk-${activeTopicKey}`);
    if (chk) chk.checked = true;
    saveProgress();
    updateNavButtons();
}
