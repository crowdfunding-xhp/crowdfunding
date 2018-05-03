package com.xhp.crowdfunding.service;

import com.xhp.crowdfunding.dao.ProjectMapper;
import com.xhp.crowdfunding.entity.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: luqinglin
 * Date: 2018-05-02
 * Time: 9:38
 */
@Service
public class ProjectService {
    @Autowired
    private ProjectMapper projectMapper;

    public List<Project> searchAll(){
        return projectMapper.searchAll();
    }

    public List<Project> searchIndex(){
        return projectMapper.searchIndex();
    }

    public void addProject(Project project){
        project.setPid(UUID.randomUUID().toString().replaceAll("-","").toLowerCase());
        projectMapper.insertSelective(project);
    }

    public Project searchById(String id) {
        return projectMapper.selectByPrimaryKey(id);
    }
}
