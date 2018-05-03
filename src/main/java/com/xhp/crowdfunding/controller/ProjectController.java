package com.xhp.crowdfunding.controller;

import com.xhp.crowdfunding.entity.Project;
import com.xhp.crowdfunding.service.ProjectService;
import com.xhp.crowdfunding.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: luqinglin
 * Date: 2018-05-02
 * Time: 9:39
 */
@RestController
@RequestMapping("/manage")
public class ProjectController {
    public static final Logger log = LoggerFactory.getLogger(ProjectController.class);
    @Autowired
    private ProjectService projectService;
    @Value("${ftp.server.http.prefix}")
    private String IMG_URL_PREFIX;
    @Autowired
    private UserService userService;

    @PostMapping("showIndex.do")
    public List<Project> showIndex() {
        return projectService.searchIndex();
    }

    @PostMapping("listProject.do")
    public List<Project> searchAll() {
        return projectService.searchAll();
    }

    @PostMapping("raiseProject.do")
    public String raiseProject(String paccountName, String pidentify, String ploc, Integer pcid, String pname,
                             String pcontent, String pdate, Integer ptargetMoney, Integer praiseDays,
                             String ptags, String pdescripTitle, String pdescripCont, MultipartFile pimage) {
        Project project = new Project();
        project.setPcid(pcid);
        project.setPaccountname(paccountName);
        project.setPidentify(pidentify);
        project.setPloc(ploc);
        project.setPname(pname);
        project.setPcontent(pcontent);
        project.setPdate(pdate);
        project.setPtargetmoney(ptargetMoney);
        project.setPraisedays(praiseDays);
        project.setPtags(ptags);
        project.setPdescriptitle(pdescripTitle);
        project.setPdescripcont(pdescripCont);
        String targetFileName = userService.upload(pimage);
        String url = IMG_URL_PREFIX + targetFileName;
        project.setPimage(url);
        try{
            projectService.addProject(project);
            return "true";
        }catch (Exception e){
            log.error(e.getMessage());
        }
        return "false";
    }

    @PostMapping("scanProjectById.do")
    public Project searchById(@RequestParam("Pid") String id){
        return projectService.searchById(id);
    }

}
